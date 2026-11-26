package discount

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

const handlerDeleteDiscount = "DeleteDiscount"

func DeleteDiscount(queries repository.StudentDiscountEditTxRepository, pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		discountIDFromParam := c.Param("discountID")
		if discountIDFromParam == "" {
			applog.Warn(c, handlerDeleteDiscount, "invalid request",
				slog.String("discountID_raw", discountIDFromParam))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing student discount ID",
				Code:    constants.MissingStudentDiscountID,
			})
			return
		}

		discountID, err := utils.ConvertToUUID(discountIDFromParam)
		if err != nil {
			applog.Warn(c, handlerDeleteDiscount, "invalid request",
				slog.String("discountID_raw", discountIDFromParam),
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
			applog.Warn(c, handlerDeleteDiscount, "invalid request",
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
			applog.Error(c, handlerDeleteDiscount, "failed to begin transaction",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to delete discount data",
				Code:    constants.InternalServerError,
			})
			return
		}
		defer tx.Rollback(ctx)

		qtx := queries.WithTx(tx)

		// Held until commit so a course change can't rescale this discount
		// while it's being deleted.
		if _, err := qtx.LockStudentForShare(ctx, studentID); err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				applog.Warn(c, handlerDeleteDiscount, "resource not found",
					applog.WithStudentID(studentIDFromParam))
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Student not found",
					Code:    constants.StudentNotFound,
				})
				return
			}
			applog.Error(c, handlerDeleteDiscount, "failed to lock student",
				applog.WithStudentID(studentIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to delete discount data",
				Code:    constants.InternalServerError,
			})
			return
		}

		_, err = qtx.GetStudentDiscountForUpdate(ctx, db.GetStudentDiscountForUpdateParams{
			ID:        discountID,
			StudentID: studentID,
		})
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				applog.Warn(c, handlerDeleteDiscount, "resource not found",
					applog.WithStudentID(studentIDFromParam),
					slog.String("discountID_raw", discountIDFromParam))
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Discount not found",
					Code:    constants.DiscountNotFound,
				})
				return
			}
			applog.Error(c, handlerDeleteDiscount, "failed to fetch discount",
				slog.String("discountID_raw", discountIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to delete discount data",
				Code:    constants.InternalServerError,
			})
			return
		}

		if err := qtx.DeleteDiscount(ctx, discountID); err != nil {
			applog.Error(c, handlerDeleteDiscount, "failed to process request",
				slog.String("discountID_raw", discountIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to delete discount data",
				Code:    constants.InternalServerError,
			})
			return
		}

		if err := tx.Commit(ctx); err != nil {
			applog.Error(c, handlerDeleteDiscount, "transaction commit failed",
				slog.String("discountID_raw", discountIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to delete discount data",
				Code:    constants.InternalServerError,
			})
			return
		}

		applog.Info(c, handlerDeleteDiscount, "discount data deleted",
			slog.String("discountID_raw", discountIDFromParam))
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Discount data deleted",
		})
	}
}
