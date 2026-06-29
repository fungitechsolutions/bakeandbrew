package bankaccounts

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	accountingRepository "github.com/suprimkhatri77/sms/backend/internal/repository/accounting"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerSetDefaultBankAccount = "SetDefaultBankAccount"

func SetDefaultBankAccount(queries accountingRepository.BankAccountTxRepository, pool *pgxpool.Pool) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		accountIDFromParam := c.Param("accountID")
		accountID, err := utils.ConvertToUUID(accountIDFromParam)
		if err != nil {
			applog.Warn(c, handlerSetDefaultBankAccount, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		tx, err := pool.Begin(ctx)
		if err != nil {
			applog.Error(c, handlerSetDefaultBankAccount, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		defer tx.Rollback(ctx)

		qtx := queries.WithTx(tx)

		isDefault, err := qtx.IsBankAccountDefault(ctx, accountID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				applog.Warn(c, handlerSetDefaultBankAccount, "resource not found",
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Bank account not found",
					Code:    constants.BankAccountNotFound,
				})
				return
			}
			applog.Error(c, handlerSetDefaultBankAccount, "failed to process request",
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}
		if isDefault {
			applog.Warn(c, handlerSetDefaultBankAccount, "conflict")
			c.JSON(http.StatusConflict, types.APIResponse{
				Success: false,
				Message: "Cannot unset default account directly. Set another account as default first.",
				Code:    constants.CannotUnsetDefaultBankAccount,
			})
			return
		}

		if err := qtx.UnsetDefaultBankAccount(ctx); err != nil {
			applog.Error(c, handlerSetDefaultBankAccount, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		result, err := qtx.SetBankAccountAsDefault(ctx, accountID)
		if err != nil {
			applog.Error(c, handlerSetDefaultBankAccount, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if result.RowsAffected() == 0 {
			applog.Warn(c, handlerSetDefaultBankAccount, "resource not found")
			c.JSON(http.StatusNotFound, types.APIResponse{
				Success: false,
				Message: "Bank account not found",
				Code:    constants.BankAccountNotFound,
			})
			return
		}

		if err := tx.Commit(ctx); err != nil {
			applog.Error(c, handlerSetDefaultBankAccount, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		applog.Info(c, handlerSetDefaultBankAccount, "bank account set to default")
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Bank account set to default",
		})
	}
}
