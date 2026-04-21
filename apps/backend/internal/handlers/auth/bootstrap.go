package auth

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/suprimkhatri77/sms/backend/internal/config"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
	"github.com/suprimkhatri77/sms/backend/internal/validator"
	"golang.org/x/crypto/bcrypt"
)

func Bootstrap(queries repository.AuthRepository, cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		secret := c.GetHeader("X-Bootstrap-Secret")
		if secret != cfg.BootstrapSecret {
			slog.Warn("unauthorized bootstrap attempt")

			c.JSON(http.StatusUnauthorized, types.APIResponse{
				Success: false,
				Message: "Unauthorized",
				Code:    constants.Unauthorized,
			})
			return
		}

		slog.Info("bootstrap authorized")

		var bootstrapRequest types.BootstrapRequest
		if err := c.ShouldBindJSON(&bootstrapRequest); err != nil {
			slog.Warn("invalid bootstrap payload", "error", err)

			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request Body",
				Code:    constants.ValidationFailed,
				Errors:  validator.Parse(err, bootstrapRequest),
			})
			return
		}

		utils.TrimStruct(&bootstrapRequest, "Password")

		hashedPassword, err := bcrypt.GenerateFromPassword(
			[]byte(bootstrapRequest.Password),
			bcrypt.DefaultCost,
		)
		if err != nil {
			slog.Error("password hashing failed during bootstrap", "error", err)

			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Something went wrong",
				Code:    constants.InternalServerError,
			})
			return
		}

		user, err := queries.CreateUser(ctx, db.CreateUserParams{
			Name:         bootstrapRequest.Name,
			Email:        bootstrapRequest.Email,
			PasswordHash: string(hashedPassword),
			Role:         "superadmin",
		})
		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "23505" {
				slog.Warn("bootstrap user already exists")

				c.JSON(http.StatusConflict, types.APIResponse{
					Success: false,
					Message: "User already exists",
					Code:    constants.UserAlreadyExists,
				})
				return
			}

			slog.Error("failed to create bootstrap user", "error", err)

			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Something went wrong",
				Code:    constants.InternalServerError,
			})
			return
		}

		slog.Info("bootstrap successful", "user_id", user.ID)

		c.JSON(http.StatusCreated, types.APIResponse{
			Success: true,
			Message: "Bootstrapped successfully",
		})
	}
}
