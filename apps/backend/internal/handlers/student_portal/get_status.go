package studentPortal

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerGetStudentStatusByUserID = "GetStudentStatusByUserID"

func GetStudentStatusByUserID(queries repository.StudentPortal) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFromContext := c.MustGet("userID").(string)
		studentID, err := utils.ConvertToUUID(studentIDFromContext)
		if err != nil {
			applog.Warn(c, handlerGetStudentStatusByUserID, "invalid request",
				applog.WithStudentID(studentIDFromContext),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		status, err := queries.GetStudentStatusByUserID(ctx, studentID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				applog.Info(c, handlerGetStudentStatusByUserID, "student profile not found",
					applog.WithStudentID(studentIDFromContext))
				c.JSON(http.StatusOK, types.APIResponse{
					Success: true,
					Message: "Student profile not found",
					Code:    constants.StudentNotRegistered,
				})
				return
			}

			applog.Error(c, handlerGetStudentStatusByUserID, "failed to process request",
				applog.WithStudentID(studentIDFromContext))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data: map[string]string{
				"status": status,
			},
		})
	}
}
