package studentPortal

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

func GetStudentCourses(queries repository.StudentPortal) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFromContext := c.MustGet("userID").(string)
		studentID, err := utils.ConvertToUUID(studentIDFromContext)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		id, err := queries.GetStudentID(ctx, studentID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		courses, err := queries.GetStudentCourses(ctx, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if len(courses) == 0 {
			courses = []db.GetStudentCoursesRow{}
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    courses,
		})

	}
}
