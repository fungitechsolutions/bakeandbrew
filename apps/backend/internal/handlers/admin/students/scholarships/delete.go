package scholarship

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerDeleteScholarship = "DeleteScholarship"

func DeleteScholarship(queries repository.StudentScholarshipEditTxRepository, pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		scholarshipIDFromParam := c.Param("scholarshipID")
		if scholarshipIDFromParam == "" {
			applog.Warn(c, handlerDeleteScholarship, "invalid request",
				slog.String("scholarshipID_raw", scholarshipIDFromParam))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing student scholarship ID",
				Code:    constants.MissingStudentScholarshipID,
			})
			return
		}

		scholarshipID, err := utils.ConvertToUUID(scholarshipIDFromParam)
		if err != nil {
			applog.Warn(c, handlerDeleteScholarship, "invalid request",
				slog.String("scholarshipID_raw", scholarshipIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		studentIDFromParam := c.Param("studentID")
		studentID, err := utils.ConvertToUUID(studentIDFromParam)
		if err != nil {
			applog.Warn(c, handlerDeleteScholarship, "invalid request",
				applog.WithStudentID(studentIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		tx, err := pool.Begin(ctx)
		if err != nil {
			applog.Error(c, handlerDeleteScholarship, "failed to begin transaction",
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

		// Held until commit so a course change can't rescale this scholarship
		// while it's being deleted.
		if _, err := qtx.LockStudentForShare(ctx, studentID); err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				applog.Warn(c, handlerDeleteScholarship, "resource not found",
					applog.WithStudentID(studentIDFromParam))
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Student not found",
					Code:    constants.StudentNotFound,
				})
				return
			}
			applog.Error(c, handlerDeleteScholarship, "failed to lock student",
				applog.WithStudentID(studentIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		_, err = qtx.GetStudentScholarshipForUpdate(ctx, db.GetStudentScholarshipForUpdateParams{
			ID:        scholarshipID,
			StudentID: studentID,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				applog.Warn(c, handlerDeleteScholarship, "resource not found",
					applog.WithStudentID(studentIDFromParam),
					slog.String("scholarshipID_raw", scholarshipIDFromParam))
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Scholarship not found",
					Code:    constants.ScholarshipNotFound,
				})
				return
			}
			applog.Error(c, handlerDeleteScholarship, "failed to fetch scholarship",
				slog.String("scholarshipID_raw", scholarshipIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if err := qtx.DeleteScholarship(ctx, scholarshipID); err != nil {
			applog.Error(c, handlerDeleteScholarship, "failed to process request",
				slog.String("scholarshipID_raw", scholarshipIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if err := tx.Commit(ctx); err != nil {
			applog.Error(c, handlerDeleteScholarship, "transaction commit failed",
				slog.String("scholarshipID_raw", scholarshipIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		applog.Info(c, handlerDeleteScholarship, "scholarship removed for the student",
			slog.String("scholarshipID_raw", scholarshipIDFromParam))
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Scholarship removed for the student",
		})
	}
}
