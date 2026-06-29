package courses

import (
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
)

const handlerListAllCourses = "ListAllCourses"

func ListAllCourses(queries repository.CoursesRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		courses, err := queries.ListCourses(ctx)

		if err != nil {
			applog.Error(c, handlerListAllCourses, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if len(courses) == 0 {
			courses = []db.Course{}
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    courses,
		})
	}
}
