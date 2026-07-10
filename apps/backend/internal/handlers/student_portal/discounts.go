package studentPortal

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerGetStudentDiscounts = "GetStudentDiscounts"

func GetStudentDiscounts(queries repository.StudentPortal) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		userIDFromContext := c.MustGet("userID").(string)

		userID, err := utils.ConvertToUUID(userIDFromContext)
		if err != nil {
			applog.Warn(c, handlerGetStudentDiscounts, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		studentID, err := queries.GetStudentID(ctx, userID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				applog.Warn(c, handlerGetStudentDiscounts, "resource not found",
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Student not found",
					Code:    constants.StudentNotFound,
				})
				return
			}
			applog.Error(c, handlerGetStudentDiscounts, "failed to process request",
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		discounts, err := queries.GetStudentDiscounts(ctx, studentID)
		if err != nil {
			applog.Error(c, handlerGetStudentDiscounts, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}
		applog.Debug(c, handlerGetStudentDiscounts, "discounts fetched",
			slog.Int("count", len(discounts)),
		)

		if len(discounts) == 0 {
			c.JSON(http.StatusOK, types.APIResponse{
				Success: true,
				Data:    []db.GetStudentDiscountsRow{},
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    discounts,
		})

	}

}
