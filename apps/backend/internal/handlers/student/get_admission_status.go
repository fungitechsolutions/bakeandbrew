package student

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

type GetStudentAdmissionStatusDataResponse struct {
	Exists    bool               `json:"exists"`
	CreatedAt pgtype.Timestamptz `json:"createdAt"`
	FullName  string             `json:"fullName"`
	Status    string             `json:"status"`
}

func GetStudentAdmissionStatus(queries repository.StudentRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFomContext := c.MustGet("userID").(string)

		studentID, err := utils.ConvertToUUID(studentIDFomContext)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		student, err := queries.GetStudentAdmissionStatus(ctx, studentID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				c.JSON(http.StatusOK, types.APIResponse{
					Success: true,
					Data: GetStudentAdmissionStatusDataResponse{
						Exists: false,
					},
				})
				return
			}
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data: GetStudentAdmissionStatusDataResponse{
				Exists:    true,
				CreatedAt: student.CreatedAt,
				FullName:  student.FullName,
				Status:    student.Status,
			},
		})
	}
}
