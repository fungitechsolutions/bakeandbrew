package bankaccounts

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	accountingRepository "github.com/suprimkhatri77/sms/backend/internal/repository/accounting"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
	"github.com/suprimkhatri77/sms/backend/internal/validator"
)

const handlerUpdateBankAccount = "UpdateBankAccount"

type UpdateBankAccountRequest struct {
	AccountName   string `json:"accountName" binding:"required,notblank,min=10,max=100"`
	AccountNumber string `json:"accountNumber" binding:"omitempty,bank_account_no"`
}

func UpdateBankAccount(queries accountingRepository.BankAccountRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		accountIDFromParam := c.Param("accountID")
		accountID, err := utils.ConvertToUUID(accountIDFromParam)
		if err != nil {
			applog.Warn(c, handlerUpdateBankAccount, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		var req UpdateBankAccountRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			applog.Warn(c, handlerUpdateBankAccount, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request data",
				Code:    constants.ValidationFailed,
				Errors:  validator.Parse(err, req),
			})
			return
		}

		utils.TrimStruct(&req)

		result, err := queries.UpdateBankAccount(ctx, db.UpdateBankAccountParams{
			AccountName:   req.AccountName,
			AccountNumber: utils.ToNullableText(req.AccountNumber),
			ID:            accountID,
		})

		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "23505" {
				applog.Warn(c, handlerUpdateBankAccount, "conflict",
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusConflict, types.APIResponse{
					Success: false,
					Message: "Account with that name already exists",
					Code:    constants.BankAccountAlreadyExists,
				})
				return

			}
			applog.Error(c, handlerUpdateBankAccount, "failed to process request",
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if result.RowsAffected() == 0 {
			applog.Warn(c, handlerUpdateBankAccount, "resource not found")
			c.JSON(http.StatusNotFound, types.APIResponse{
				Success: false,
				Message: "Bank account not found",
				Code:    constants.BankAccountNotFound,
			})
			return
		}

		applog.Info(c, handlerUpdateBankAccount, "bank account updated")
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Bank account updated",
		})

	}
}
