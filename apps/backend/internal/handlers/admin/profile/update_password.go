package profile

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
	"golang.org/x/crypto/bcrypt"
)

const handlerUpdatePassword = "UpdatePassword"

type UpdatePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required,min=8"`
	NewPassword     string `json:"new_password" binding:"required,min=8"`
}

func UpdatePassword(queries repository.AdminRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		userIDFromContext := c.MustGet("userID").(string)
		userID, err := utils.ConvertToUUID(userIDFromContext)
		if err != nil {
			applog.Warn(c, handlerUpdatePassword, "invalid user id format",
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

		var req UpdatePasswordRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			applog.Warn(c, handlerUpdatePassword, "invalid request data",
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request data",
				Code:    constants.ValidationFailed,
			})
			return
		}

		user, err := queries.GetUserByID(ctx, userID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				applog.Warn(c, handlerUpdatePassword, "user not found",
					slog.String(applog.AttrUserID, userIDFromContext),
				)
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "User not found",
					Code:    constants.UserNotFound,
				})
				return
			}
			applog.Error(c, handlerUpdatePassword, "failed to get user",
				slog.String(applog.AttrUserID, userIDFromContext),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to get user",
				Code:    constants.InternalServerError,
			})
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.CurrentPassword)); err != nil {
			applog.Warn(c, handlerUpdatePassword, "invalid current password",
				slog.String(applog.AttrUserID, userIDFromContext),
			)
			c.JSON(http.StatusUnprocessableEntity, types.APIResponse{
				Success: false,
				Message: "Invalid current password",
				Code:    constants.Unauthorized,
			})
			return
		}

		if req.NewPassword == req.CurrentPassword {
			applog.Warn(c, handlerUpdatePassword, "new password matches current password",
				slog.String(applog.AttrUserID, userIDFromContext),
			)
			c.JSON(http.StatusUnprocessableEntity, types.APIResponse{
				Success: false,
				Message: "New password cannot be the same as the current password",
				Code:    constants.ValidationFailed,
			})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
		if err != nil {
			applog.Error(c, handlerUpdatePassword, "failed to hash password",
				slog.String(applog.AttrUserID, userIDFromContext),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to hash password",
				Code:    constants.InternalServerError,
			})
			return
		}

		_, err = queries.UpdateUserPassword(ctx, db.UpdateUserPasswordParams{
			ID:           userID,
			PasswordHash: string(hashedPassword),
		})

		if err != nil {
			applog.Error(c, handlerUpdatePassword, "failed to update password",
				slog.String(applog.AttrUserID, userIDFromContext),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to update password",
				Code:    constants.InternalServerError,
			})
			return
		}

		applog.Info(c, handlerUpdatePassword, "password updated successfully",
			slog.String(applog.AttrUserID, userIDFromContext),
		)

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Password updated successfully",
		})
	}
}
