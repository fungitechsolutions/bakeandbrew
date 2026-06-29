package profile

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

type UpdateProfileRequest struct {
	Name     string `json:"name" binding:"required,notblank,min=2,max=50,alphaspace"`
	ImageUrl string `json:"imageUrl" binding:"omitempty,url"`
}

func UpdateProfile(queries repository.AdminRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		userIDFromContext := c.MustGet("userID").(string)
		userID, err := utils.ConvertToUUID(userIDFromContext)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid user ID format",
				Code:    constants.ValidationFailed,
			})
			return
		}

		var req UpdateProfileRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request body",
				Code:    constants.ValidationFailed,
			})
			return
		}

		utils.TrimStruct(&req)

		updatedUser, err := queries.UpdateUserProfile(ctx, db.UpdateUserProfileParams{
			ID:       userID,
			Name:     req.Name,
			ImageUrl: utils.ToNullableText(req.ImageUrl),
		})

		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to update profile",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Profile updated successfully",
			Data:    updatedUser,
		})
	}
}
