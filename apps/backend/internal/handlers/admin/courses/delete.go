package courses

import (
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerDeleteCourse = "DeleteCourse"

func DeleteCourse(queries repository.AdminRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		courseIDFromParam := c.Param("courseID")
		if courseIDFromParam == "" {
			applog.Warn(c, handlerDeleteCourse, "invalid request",
				slog.String("courseID_raw", courseIDFromParam))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing course ID",
				Code:    constants.MissingCourseID,
			})
			return
		}

		courseID, err := utils.ConvertToUUID(courseIDFromParam)

		if err != nil {
			applog.Warn(c, handlerDeleteCourse, "invalid request",
				slog.String("courseID_raw", courseIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		result, err := queries.DeleteCourse(ctx, courseID)
		if err != nil {
			applog.Error(c, handlerDeleteCourse, "failed to process request",
				slog.String("courseID_raw", courseIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if result.RowsAffected() == 0 {
			applog.Warn(c, handlerDeleteCourse, "resource not found")
			c.JSON(http.StatusNotFound, types.APIResponse{
				Success: false,
				Message: "Course not found",
				Code:    constants.CourseNotFound,
			})
			return
		}

		applog.Info(c, handlerDeleteCourse, "course deleted")
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Course deleted",
		})
	}
}
