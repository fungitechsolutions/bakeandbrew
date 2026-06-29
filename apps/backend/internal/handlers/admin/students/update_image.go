package students

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

type UpdateStudentImageRequest struct {
	ImageUrl string `json:"imageUrl" binding:"omitempty,url"`
}

func UpdateStudentImage(queries repository.AdminRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFromParams := c.Param("studentID")

		studentID, err := utils.ConvertToUUID(studentIDFromParams)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		var req UpdateStudentImageRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid image URL",
				Code:    constants.ValidationFailed,
			})
			return
		}

		utils.TrimStruct(&req)

		_, err = queries.UpdateStudentImage(ctx, db.UpdateStudentImageParams{
			ID:       studentID,
			PhotoUrl: utils.ToNullableText(req.ImageUrl),
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to update student image",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Student image updated successfully",
		})
	}

}
