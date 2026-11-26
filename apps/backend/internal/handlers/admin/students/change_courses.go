package students

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/export"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
	"github.com/suprimkhatri77/sms/backend/internal/validator"
)

const handlerChangeStudentCourses = "ChangeStudentCourses"

// courseChangeConfirmation is the word an admin types to change the courses
// of a student who has payments, discounts or a scholarship.
const courseChangeConfirmation = "CONFIRM"

// nepalTime is UTC+5:45, fixed so it doesn't depend on tzdata in the image.
var nepalTime = time.FixedZone("NPT", 5*60*60+45*60)

type ChangeStudentCoursesRequest struct {
	CourseIDs []string `json:"courseIds" binding:"required,min=1,dive,uuid"`
	// DryRun works out the change and returns it without saving, for the
	// confirmation step.
	DryRun       bool   `json:"dryRun"`
	Confirmation string `json:"confirmation" binding:"omitempty,max=20"`
	Reason       string `json:"reason" binding:"omitempty,max=500"`
	// Expected is the preview the admin confirmed. If a payment, discount or
	// scholarship changed since, the save is refused with a fresh preview
	// instead of committing numbers the admin never saw.
	Expected *courseChangeExpected `json:"expected"`
}

type courseChangeExpected struct {
	TotalPaid            int64 `json:"totalPaid"`
	NewTotalFee          int64 `json:"newTotalFee"`
	NewAdjustments       int64 `json:"newAdjustments"`
	ExcessAmount         int64 `json:"excessAmount"`
	RequiresConfirmation bool  `json:"requiresConfirmation"`
}

func (e courseChangeExpected) matches(summary courseChangeSummary) bool {
	return e.TotalPaid == summary.TotalPaid &&
		e.NewTotalFee == summary.NewTotalFee &&
		e.NewAdjustments == summary.NewAdjustments &&
		e.ExcessAmount == summary.ExcessAmount &&
		e.RequiresConfirmation == summary.RequiresConfirmation
}

// courseSnapshot is a course as it applies to the student: fee is the
// enrolled fee for a kept course, the current fee for a new one (paisa).
type courseSnapshot struct {
	ID   pgtype.UUID `json:"id"`
	Name string      `json:"name"`
	Fee  int64       `json:"fee"`
}

type courseChangeAdjustment struct {
	Kind      string `json:"kind"`
	Label     string `json:"label"`
	OldAmount int64  `json:"oldAmount"`
	NewAmount int64  `json:"newAmount"`
}

// courseChangeSummary is what a course change does to the student's fees.
// Amounts are in paisa.
type courseChangeSummary struct {
	OldCourses     []courseSnapshot         `json:"oldCourses"`
	NewCourses     []courseSnapshot         `json:"newCourses"`
	OldTotalFee    int64                    `json:"oldTotalFee"`
	NewTotalFee    int64                    `json:"newTotalFee"`
	TotalPaid      int64                    `json:"totalPaid"`
	OldAdjustments int64                    `json:"oldAdjustments"`
	NewAdjustments int64                    `json:"newAdjustments"`
	Adjustments    []courseChangeAdjustment `json:"adjustments"`
	BalanceDue     int64                    `json:"balanceDue"`
	ExcessAmount   int64                    `json:"excessAmount"`
	// RequiresConfirmation is true when the student has payments, discounts
	// or a scholarship, so saving needs the typed confirmation.
	RequiresConfirmation bool `json:"requiresConfirmation"`
}

// diffCourseIDs returns which courses to enroll in and which to drop to turn
// current into requested. Duplicates in requested are ignored.
func diffCourseIDs(current, requested []pgtype.UUID) (toAdd, toRemove []pgtype.UUID) {
	currentSet := make(map[pgtype.UUID]struct{}, len(current))
	for _, id := range current {
		currentSet[id] = struct{}{}
	}

	requestedSet := make(map[pgtype.UUID]struct{}, len(requested))
	for _, id := range requested {
		if _, seen := requestedSet[id]; seen {
			continue
		}
		requestedSet[id] = struct{}{}
		if _, enrolled := currentSet[id]; !enrolled {
			toAdd = append(toAdd, id)
		}
	}

	for _, id := range current {
		if _, keep := requestedSet[id]; !keep {
			toRemove = append(toRemove, id)
		}
	}

	return toAdd, toRemove
}

// courseChangeBlockedMessage explains why a student's records rule out a
// course change, or returns "" when there are none. Payments, discounts and a
// scholarship are carried over to the new courses; a certificate names the
// course it was issued for, so it can't be.
func courseChangeBlockedMessage(blockers db.GetStudentCourseChangeBlockersRow) string {
	if blockers.CertificateCount > 0 {
		return "Course can't be changed because this student already has a certificate"
	}
	return ""
}

// courseChangeNeedsConfirmation reports whether the student has money records
// that the change carries over, which the admin must confirm by typing.
func courseChangeNeedsConfirmation(blockers db.GetStudentCourseChangeBlockersRow) bool {
	return blockers.PaymentCount > 0 || blockers.DiscountCount > 0 || blockers.ScholarshipCount > 0
}

func courseNames(courses []courseSnapshot) string {
	names := make([]string, len(courses))
	for i, course := range courses {
		names[i] = course.Name
	}
	return strings.Join(names, ", ")
}

// overpaidNote is appended to the student's notes when the new courses cost
// less than what was already paid.
func overpaidNote(now time.Time, summary courseChangeSummary) string {
	return fmt.Sprintf(
		"%s: Course changed from %s to %s. Paid NPR %s against the new fee of NPR %s, so NPR %s is owed back to the student (refund or credit).",
		now.In(nepalTime).Format("2006-01-02"),
		courseNames(summary.OldCourses),
		courseNames(summary.NewCourses),
		export.Rupees(summary.TotalPaid),
		export.Rupees(summary.NewTotalFee),
		export.Rupees(summary.ExcessAmount),
	)
}

func ChangeStudentCourses(queries repository.AdminStudentCoursesTxRepository, pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFromParams := c.Param("studentID")
		studentID, err := utils.ConvertToUUID(studentIDFromParams)
		if err != nil {
			applog.Warn(c, handlerChangeStudentCourses, "invalid request",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		var req ChangeStudentCoursesRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			applog.Warn(c, handlerChangeStudentCourses, "invalid request",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Please select at least one valid course and keep the reason under 500 characters",
				Code:    constants.ValidationFailed,
				Errors:  validator.Parse(err, req),
			})
			return
		}
		req.Reason = strings.TrimSpace(req.Reason)

		adminIDFromContext := c.MustGet("userID").(string)
		adminID, err := utils.ConvertToUUID(adminIDFromContext)
		if err != nil {
			applog.Error(c, handlerChangeStudentCourses, "invalid admin id in context",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		requested := make([]pgtype.UUID, 0, len(req.CourseIDs))
		for _, v := range req.CourseIDs {
			courseID, err := utils.ConvertToUUID(v)
			if err != nil {
				applog.Warn(c, handlerChangeStudentCourses, "invalid course id",
					slog.String("course_id", v),
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusBadRequest, types.APIResponse{
					Success: false,
					Message: "Invalid course ID",
					Code:    constants.InvalidIDFormat,
				})
				return
			}
			requested = append(requested, courseID)
		}

		tx, err := pool.Begin(ctx)
		if err != nil {
			applog.Error(c, handlerChangeStudentCourses, "failed to begin transaction",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}
		defer tx.Rollback(ctx)

		qtx := queries.WithTx(tx)

		// Everything below reads after this lock, so a payment, discount,
		// scholarship, certificate or status change can't slip past the checks.
		status, err := qtx.LockStudentForUpdate(ctx, studentID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				applog.Warn(c, handlerChangeStudentCourses, "resource not found",
					applog.WithStudentID(studentIDFromParams))
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Student not found",
					Code:    constants.StudentNotFound,
				})
				return
			}
			applog.Error(c, handlerChangeStudentCourses, "failed to lock student",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if status != "pending" && status != "active" {
			applog.Warn(c, handlerChangeStudentCourses, "course change refused",
				applog.WithStudentID(studentIDFromParams),
				slog.String(applog.AttrStudentStatus, status))
			c.JSON(http.StatusConflict, types.APIResponse{
				Success: false,
				Message: "Course can only be changed for a pending or active student",
				Code:    constants.CourseChangeNotAllowed,
			})
			return
		}

		blockers, err := qtx.GetStudentCourseChangeBlockers(ctx, studentID)
		if err != nil {
			applog.Error(c, handlerChangeStudentCourses, "failed to check student records",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if message := courseChangeBlockedMessage(blockers); message != "" {
			applog.Warn(c, handlerChangeStudentCourses, "course change refused",
				applog.WithStudentID(studentIDFromParams),
				slog.String("reason", message))
			c.JSON(http.StatusConflict, types.APIResponse{
				Success: false,
				Message: message,
				Code:    constants.CourseChangeNotAllowed,
			})
			return
		}

		requiresConfirmation := courseChangeNeedsConfirmation(blockers)

		enrolled, err := qtx.GetCoursesByStudentID(ctx, studentID)
		if err != nil {
			applog.Error(c, handlerChangeStudentCourses, "failed to fetch enrolled courses",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		current := make([]pgtype.UUID, 0, len(enrolled))
		oldCourses := make([]courseSnapshot, 0, len(enrolled))
		snapshots := make(map[pgtype.UUID]courseSnapshot, len(enrolled)+len(requested))
		var oldTotalFee int64
		for _, course := range enrolled {
			current = append(current, course.ID)
			snapshot := courseSnapshot{ID: course.ID, Name: course.Name, Fee: course.FeeAtEnrollment}
			oldCourses = append(oldCourses, snapshot)
			snapshots[course.ID] = snapshot
			oldTotalFee += course.FeeAtEnrollment
		}

		toAdd, toRemove := diffCourseIDs(current, requested)
		if len(toAdd) == 0 && len(toRemove) == 0 {
			c.JSON(http.StatusOK, types.APIResponse{
				Success: true,
				Message: "No changes to save",
			})
			return
		}

		// Only newly added courses are checked: a kept course may have gone
		// inactive since the student enrolled, and that shouldn't block them.
		if len(toAdd) > 0 {
			addedCourses, err := qtx.GetCoursesByIDs(ctx, toAdd)
			if err != nil {
				applog.Error(c, handlerChangeStudentCourses, "failed to fetch course fees",
					applog.WithStudentID(studentIDFromParams),
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusInternalServerError, types.APIResponse{
					Success: false,
					Message: "Failed to process request",
					Code:    constants.InternalServerError,
				})
				return
			}

			if len(addedCourses) != len(toAdd) {
				applog.Warn(c, handlerChangeStudentCourses, "one or more courses not found",
					applog.WithStudentID(studentIDFromParams),
					slog.Int("requested", len(toAdd)),
					slog.Int("found", len(addedCourses)))
				c.JSON(http.StatusBadRequest, types.APIResponse{
					Success: false,
					Message: "One or more courses not found",
					Code:    constants.CourseNotFound,
				})
				return
			}

			for _, course := range addedCourses {
				if !course.IsActive {
					applog.Warn(c, handlerChangeStudentCourses, "inactive course selected",
						applog.WithStudentID(studentIDFromParams))
					c.JSON(http.StatusBadRequest, types.APIResponse{
						Success: false,
						Message: "One or more selected courses are no longer active",
						Code:    constants.CourseInactive,
					})
					return
				}
				snapshots[course.ID] = courseSnapshot{ID: course.ID, Name: course.Name, Fee: int64(course.Fee)}
			}
		}

		// In the order the admin picked them; requested may hold duplicates.
		newCourses := make([]courseSnapshot, 0, len(requested))
		seen := make(map[pgtype.UUID]struct{}, len(requested))
		var newTotalFee int64
		for _, id := range requested {
			if _, dup := seen[id]; dup {
				continue
			}
			seen[id] = struct{}{}
			newCourses = append(newCourses, snapshots[id])
			newTotalFee += snapshots[id].Fee
		}

		feeSummary, err := qtx.GetStudentFeeSummary(ctx, studentID)
		if err != nil {
			applog.Error(c, handlerChangeStudentCourses, "failed to fetch fee summary",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		discounts, err := qtx.GetStudentDiscountsForCourseChange(ctx, studentID)
		if err != nil {
			applog.Error(c, handlerChangeStudentCourses, "failed to fetch discounts",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		scholarships, err := qtx.GetStudentScholarshipForCourseChange(ctx, studentID)
		if err != nil {
			applog.Error(c, handlerChangeStudentCourses, "failed to fetch scholarship",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		// adjustments holds the discounts then the scholarship; adjustmentIDs
		// matches it index for index.
		adjustments := make([]feeAdjustment, 0, len(discounts)+len(scholarships))
		adjustmentIDs := make([]pgtype.UUID, 0, len(discounts)+len(scholarships))
		for _, discount := range discounts {
			adjustments = append(adjustments, feeAdjustment{
				Kind:      adjustmentKindDiscount,
				Label:     discount.Type,
				Scales:    discount.Mode == "percent",
				Amount:    discount.Amount,
				CreatedAt: discount.CreatedAt.Time,
			})
			adjustmentIDs = append(adjustmentIDs, discount.ID)
		}
		for _, scholarship := range scholarships {
			adjustments = append(adjustments, feeAdjustment{
				Kind:      adjustmentKindScholarship,
				Label:     "Scholarship",
				Scales:    true,
				Amount:    scholarship.Amount,
				CreatedAt: scholarship.CreatedAt.Time,
			})
			adjustmentIDs = append(adjustmentIDs, scholarship.ID)
		}

		newAmounts, excess := planCourseChangeAdjustments(oldTotalFee, newTotalFee, feeSummary.TotalPaid, adjustments)

		summary := courseChangeSummary{
			OldCourses:           oldCourses,
			NewCourses:           newCourses,
			OldTotalFee:          oldTotalFee,
			NewTotalFee:          newTotalFee,
			TotalPaid:            feeSummary.TotalPaid,
			Adjustments:          make([]courseChangeAdjustment, len(adjustments)),
			ExcessAmount:         excess,
			RequiresConfirmation: requiresConfirmation,
		}
		for i, adj := range adjustments {
			summary.Adjustments[i] = courseChangeAdjustment{
				Kind:      adj.Kind,
				Label:     adj.Label,
				OldAmount: adj.Amount,
				NewAmount: newAmounts[i],
			}
			summary.OldAdjustments += adj.Amount
			summary.NewAdjustments += newAmounts[i]
		}
		summary.BalanceDue = max(0, newTotalFee-feeSummary.TotalPaid-summary.NewAdjustments)

		if req.DryRun {
			// The deferred rollback releases the lock; nothing was written.
			c.JSON(http.StatusOK, types.APIResponse{
				Success: true,
				Message: "Course change preview",
				Data:    summary,
			})
			return
		}

		if req.Expected != nil && !req.Expected.matches(summary) {
			applog.Warn(c, handlerChangeStudentCourses, "course change preview out of date",
				applog.WithStudentID(studentIDFromParams))
			c.JSON(http.StatusConflict, types.APIResponse{
				Success: false,
				Message: "The student's payments or adjustments changed. Check the new numbers and confirm again.",
				Code:    constants.CourseChangePreviewOutdated,
				Data:    summary,
			})
			return
		}

		if requiresConfirmation && req.Confirmation != courseChangeConfirmation {
			applog.Warn(c, handlerChangeStudentCourses, "course change not confirmed",
				applog.WithStudentID(studentIDFromParams))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: fmt.Sprintf("This student has payments or adjustments. Type %s to change the course.", courseChangeConfirmation),
				Code:    constants.CourseChangeConfirmationRequired,
			})
			return
		}

		for _, courseID := range toRemove {
			err := qtx.RemoveStudentFromCourse(ctx, db.RemoveStudentFromCourseParams{
				StudentID: studentID,
				CourseID:  courseID,
			})
			if err != nil {
				applog.Error(c, handlerChangeStudentCourses, "failed to remove course",
					applog.WithStudentID(studentIDFromParams),
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusInternalServerError, types.APIResponse{
					Success: false,
					Message: "Failed to process request",
					Code:    constants.InternalServerError,
				})
				return
			}
		}

		for _, courseID := range toAdd {
			err := qtx.EnrollStudentInCourse(ctx, db.EnrollStudentInCourseParams{
				StudentID:       studentID,
				CourseID:        courseID,
				FeeAtEnrollment: snapshots[courseID].Fee,
			})
			if err != nil {
				var pgErr *pgconn.PgError
				if errors.As(err, &pgErr) && pgErr.Code == "23503" {
					applog.Warn(c, handlerChangeStudentCourses, "course not found during enrollment",
						applog.WithStudentID(studentIDFromParams),
						slog.String("constraint", pgErr.ConstraintName))
					c.JSON(http.StatusBadRequest, types.APIResponse{
						Success: false,
						Message: "Course not found",
						Code:    constants.CourseNotFound,
					})
					return
				}
				applog.Error(c, handlerChangeStudentCourses, "failed to enroll student",
					applog.WithStudentID(studentIDFromParams),
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusInternalServerError, types.APIResponse{
					Success: false,
					Message: "Failed to process request",
					Code:    constants.InternalServerError,
				})
				return
			}
		}

		for i, adj := range adjustments {
			if newAmounts[i] == adj.Amount {
				continue
			}
			var err error
			if adj.Kind == adjustmentKindScholarship {
				err = qtx.UpdateScholarshipAmount(ctx, db.UpdateScholarshipAmountParams{
					ID:     adjustmentIDs[i],
					Amount: newAmounts[i],
				})
			} else {
				err = qtx.UpdateDiscountAmount(ctx, db.UpdateDiscountAmountParams{
					ID:     adjustmentIDs[i],
					Amount: newAmounts[i],
				})
			}
			if err != nil {
				applog.Error(c, handlerChangeStudentCourses, "failed to rescale "+adj.Kind,
					applog.WithStudentID(studentIDFromParams),
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusInternalServerError, types.APIResponse{
					Success: false,
					Message: "Failed to process request",
					Code:    constants.InternalServerError,
				})
				return
			}
		}

		oldCoursesJSON, err := json.Marshal(summary.OldCourses)
		if err != nil {
			applog.Error(c, handlerChangeStudentCourses, "failed to encode old courses",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}
		newCoursesJSON, err := json.Marshal(summary.NewCourses)
		if err != nil {
			applog.Error(c, handlerChangeStudentCourses, "failed to encode new courses",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		err = qtx.CreateStudentCourseChange(ctx, db.CreateStudentCourseChangeParams{
			StudentID:      studentID,
			ChangedBy:      adminID,
			OldCourses:     oldCoursesJSON,
			NewCourses:     newCoursesJSON,
			OldTotalFee:    summary.OldTotalFee,
			NewTotalFee:    summary.NewTotalFee,
			TotalPaid:      summary.TotalPaid,
			OldAdjustments: summary.OldAdjustments,
			NewAdjustments: summary.NewAdjustments,
			ExcessAmount:   summary.ExcessAmount,
			Reason:         utils.ToNullableText(req.Reason),
		})
		if err != nil {
			applog.Error(c, handlerChangeStudentCourses, "failed to record course change",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if summary.ExcessAmount > 0 {
			err := qtx.AppendStudentNote(ctx, db.AppendStudentNoteParams{
				ID:   studentID,
				Note: overpaidNote(time.Now(), summary),
			})
			if err != nil {
				applog.Error(c, handlerChangeStudentCourses, "failed to add overpaid note",
					applog.WithStudentID(studentIDFromParams),
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusInternalServerError, types.APIResponse{
					Success: false,
					Message: "Failed to process request",
					Code:    constants.InternalServerError,
				})
				return
			}
		}

		if err := tx.Commit(ctx); err != nil {
			applog.Error(c, handlerChangeStudentCourses, "transaction commit failed",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		// applog.Base already records the admin as user_id.
		applog.Info(c, handlerChangeStudentCourses, "student courses changed",
			applog.WithStudentID(studentIDFromParams),
			slog.String("old_courses", courseNames(summary.OldCourses)),
			slog.String("new_courses", courseNames(summary.NewCourses)),
			slog.Int64("total_paid", summary.TotalPaid),
			slog.Int64("excess_amount", summary.ExcessAmount))

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Courses updated",
			Data:    summary,
		})
	}
}
