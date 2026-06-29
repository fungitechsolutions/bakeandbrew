package scholarship

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

func ListStudentScholarshipDetail(queries repository.StudentsScholarship) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFromParam := c.Param("studentID")
		if studentIDFromParam == "" {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing student ID",
				Code:    constants.MissingStudentID,
			})
			return
		}

		studentID, err := utils.ConvertToUUID(studentIDFromParam)
		if err != nil {
			applog.Error(c, "ListStudentScholarshipDetail", "invalid student id format",
				slog.String("student_id_raw", studentIDFromParam),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		scholarship, err := queries.GetScholarshipByStudent(ctx, studentID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				c.JSON(http.StatusOK, types.APIResponse{
					Success: true,
					Message: "No scholarship found",
					Data:    nil,
				})
				return
			}
			applog.Error(c, "ListStudentScholarshipDetail", "failed to fetch scholarship",
				applog.WithStudentID(studentIDFromParam),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    scholarship,
		})
	}
}
