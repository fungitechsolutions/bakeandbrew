package admin

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/jackc/pgx/v5"
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

func CreateUser(
	queries repository.AuthRepository,
	cfg *config.Config,
) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		var CreateUserRequest types.CreateUserRequest
		if err := c.ShouldBindJSON(&CreateUserRequest); err != nil {
			slog.Warn("invalid request payload", "error", err)

			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request data",
				Code:    constants.ValidationFailed,
				Errors:  validator.Parse(err, CreateUserRequest),
			})
			return
		}

		utils.TrimStruct(&CreateUserRequest, "Password")

		_, err := queries.GetUserByEmail(ctx, CreateUserRequest.Email)

		if err == nil {
			slog.Warn("user already exists", "email", CreateUserRequest.Email)

			c.JSON(http.StatusConflict, types.APIResponse{
				Success: false,
				Message: "User already exists",
				Code:    constants.UserAlreadyExists,
			})
			return
		}

		if !errors.Is(err, pgx.ErrNoRows) {
			slog.Error("failed checking user existence", "error", err)

			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to register user",
				Code:    constants.InternalServerError,
			})
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword(
			[]byte(CreateUserRequest.Password),
			bcrypt.DefaultCost,
		)
		if err != nil {
			slog.Error("password hashing failed", "error", err)

			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to register user",
				Code:    constants.InternalServerError,
			})
			return
		}

		_, err = queries.CreateUser(ctx, db.CreateUserParams{
			Name:         CreateUserRequest.Name,
			Email:        CreateUserRequest.Email,
			PasswordHash: string(hashedPassword),
			Role:         "user",
		})

		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "23505" {
				slog.Warn("duplicate user on insert", "email", CreateUserRequest.Email)

				c.JSON(http.StatusConflict, types.APIResponse{
					Success: false,
					Message: "User already Exists",
					Code:    constants.UserAlreadyExists,
				})
				return
			}

			slog.Error("failed to create user", "error", err)

			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to register user",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusCreated, types.APIResponse{
			Success: true,
			Message: "Registration successful",
		})
	}
}
