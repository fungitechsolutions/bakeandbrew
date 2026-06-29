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

// public facing endpoint to get active courses in the form
const handlerListAllActiveCourses = "ListAllActiveCourses"

func ListAllActiveCourses(queries repository.CoursesRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		courses, err := queries.ListActiveCourses(ctx)

		if err != nil {
			applog.Error(c, handlerListAllActiveCourses, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if len(courses) == 0 {
			applog.Info(c, handlerListAllActiveCourses, "no courses found")
			c.JSON(http.StatusOK, types.APIResponse{
				Success: true,
				Message: "No courses found",
				Data:    []types.Courses{},
			})
			return
		}

		var coursesList []types.Courses

		for _, v := range courses {
			coursesList = append(coursesList, types.Courses{
				ID:       v.ID,
				Name:     v.Name,
				IsActive: v.IsActive,
				Fee:      int(v.Fee),
			})
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    coursesList,
		})
	}
}
