package courses

import (
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
)

const handlerGetCourseDetail = "GetCourseDetail"

func GetCourseDetail(queries repository.CoursesRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		courseSlug := c.Param("slug")

		if courseSlug == "" {
			applog.Warn(c, handlerGetCourseDetail, "invalid request")
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing page parameter",
				Code:    constants.InvalidPageParam,
			})
			return
		}

		course, err := queries.GetCourseBySlug(ctx, courseSlug)
		if err != nil {
			applog.Error(c, handlerGetCourseDetail, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process requests",
				Code:    constants.ValidationFailed,
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    course,
		})

	}
}
