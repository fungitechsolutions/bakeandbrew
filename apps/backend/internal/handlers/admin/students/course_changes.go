package students

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerStudentCourseChanges = "StudentCourseChanges"

// StudentCourseChanges lists a student's course changes, newest first.
func StudentCourseChanges(queries repository.AdminRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFromParams := c.Param("studentID")
		studentID, err := utils.ConvertToUUID(studentIDFromParams)
		if err != nil {
			applog.Warn(c, handlerStudentCourseChanges, "invalid request",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		changes, err := queries.ListStudentCourseChanges(ctx, studentID)
		if err != nil {
			applog.Error(c, handlerStudentCourseChanges, "failed to list course changes",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}
		if changes == nil {
			changes = []db.ListStudentCourseChangesRow{}
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    changes,
		})
	}
}
