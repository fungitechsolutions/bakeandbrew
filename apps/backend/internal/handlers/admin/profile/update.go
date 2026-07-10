package profile

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

const handlerUpdateProfile = "UpdateProfile"

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
			applog.Warn(c, handlerUpdateProfile, "invalid user id format",
				slog.String("user_id_raw", userIDFromContext),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid user ID format",
				Code:    constants.ValidationFailed,
			})
			return
		}

		var req UpdateProfileRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			applog.Warn(c, handlerUpdateProfile, "invalid request body",
				slog.Any(applog.AttrError, err),
			)
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
			applog.Error(c, handlerUpdateProfile, "failed to update profile",
				slog.String(applog.AttrUserID, userIDFromContext),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to update profile",
				Code:    constants.InternalServerError,
			})
			return
		}

		applog.Info(c, handlerUpdateProfile, "profile updated successfully",
			slog.String(applog.AttrUserID, userIDFromContext),
		)

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Profile updated successfully",
			Data:    updatedUser,
		})
	}
}
