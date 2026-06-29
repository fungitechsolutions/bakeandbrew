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

const handlerGetStudentRejectedOverview = "GetStudentRejectedOverview"

func GetStudentRejectedOverview(queries repository.StudentPortal) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFromContext := c.MustGet("userID").(string)
		studentID, err := utils.ConvertToUUID(studentIDFromContext)
		if err != nil {
			applog.Warn(c, handlerGetStudentRejectedOverview, "invalid request",
				applog.WithStudentID(studentIDFromContext),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		overview, err := queries.GetStudentRejectedOverview(ctx, studentID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				applog.Warn(c, handlerGetStudentRejectedOverview, "resource not found",
					applog.WithStudentID(studentIDFromContext),
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Student not found",
					Code:    constants.StudentNotFound,
				})
				return
			}
			applog.Error(c, handlerGetStudentRejectedOverview, "failed to process request",
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
			Data:    overview,
		})
	}
}
