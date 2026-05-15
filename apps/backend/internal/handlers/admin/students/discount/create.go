package discount

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
	"github.com/suprimkhatri77/sms/backend/internal/validator"
)

type CreateDiscountRequest struct {
	Type    string  `json:"type" binding:"required,min=1,max=50"`
	Note    string  `json:"note" binding:"omitempty,min=1,max=100"`
	Percent float64 `json:"percent" binding:"required,gt=0"`
}

func CreateDiscount(queries repository.StudentDiscounts) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFromParam := c.Param("studentID")
		if studentIDFromParam == "" {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing student discount ID",
				Code:    constants.MissingStudentDiscountID,
			})
			return
		}

		studentID, err := utils.ConvertToUUID(studentIDFromParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		var req CreateDiscountRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request data",
				Code:    constants.ValidationFailed,
				Errors:  validator.Parse(err, req),
			})
			return
		}

		utils.TrimStruct(&req)

		summary, err := queries.GetStudentFeeSummary(ctx, studentID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		// total fee to be paid
		effectiveFee := summary.TotalFee

		// total discount the student had (eg: if the std had 2 discounts of 5 and 10 % the res gives the total of it i.e 15%)
		discountPercent, err := utils.NumericToFloat64(summary.TotalDiscountPercent)
		if err != nil {
			slog.Error("failed to convert discount percent",
				"error", err,
				"path", c.FullPath(),
				"ip", c.ClientIP(),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		// scholarship percent
		scholarshipPercent, err := utils.NumericToFloat64(summary.ScholarshipPercent)
		if err != nil {
			slog.Error("failed to convert scholarship percent",
				"error", err,
				"path", c.FullPath(),
				"ip", c.ClientIP(),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		discountAmount := int64(float64(effectiveFee) * discountPercent / 100)
		scholarshipAmount := int64(float64(effectiveFee) * scholarshipPercent / 100)
		alreadyCovered := summary.TotalPaid + discountAmount + scholarshipAmount

		if alreadyCovered >= effectiveFee {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "No outstanding balance remaining for this student",
				Code:    constants.ValidationFailed,
			})
			return
		}

		newDiscountAmount := effectiveFee * int64(req.Percent) / 100
		if alreadyCovered+newDiscountAmount > effectiveFee {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Discount exceeds outstanding balance",
				Code:    constants.ValidationFailed,
			})
			return
		}

		percent, err := utils.ToNumeric(req.Percent)
		if err != nil {
			slog.Error("failed to convert percent",
				"error", err,
				"path", c.FullPath(),
				"ip", c.ClientIP(),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		discount, err := queries.CreateDiscount(ctx, db.CreateDiscountParams{
			StudentID: studentID,
			Type:      req.Type,
			Note:      utils.ToNullableText(req.Note),
			Percent:   percent,
		})

		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "23503" {
				c.JSON(http.StatusConflict, types.APIResponse{
					Success: false,
					Message: "Student not found",
					Code:    constants.StudentNotFound,
				})
				return
			}
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusCreated, types.APIResponse{
			Success: true,
			Message: "Discount added for the student",
			Data:    discount,
		})

	}
}
