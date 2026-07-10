package bankaccounts

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	accountingRepository "github.com/suprimkhatri77/sms/backend/internal/repository/accounting"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerDeleteBankAccount = "DeleteBankAccount"

func DeleteBankAccount(queries accountingRepository.BankAccountRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		accountIDFromParam := c.Param("accountID")
		accountID, err := utils.ConvertToUUID(accountIDFromParam)
		if err != nil {
			applog.Warn(c, handlerDeleteBankAccount, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		isDefault, err := queries.IsBankAccountDefault(ctx, accountID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				applog.Warn(c, handlerDeleteBankAccount, "resource not found",
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Bank account not found",
					Code:    constants.BankAccountNotFound,
				})
				return
			}
			applog.Error(c, handlerDeleteBankAccount, "failed to process request",
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
			applog.Warn(c, handlerDeleteBankAccount, "conflict")
			c.JSON(http.StatusConflict, types.APIResponse{
				Success: false,
				Message: "Cannot delete default bank account. Set another account as default first.",
				Code:    constants.CannotDeleteDefaultBankAccount,
			})
			return
		}

		result, err := queries.DeleteBankAccount(ctx, accountID)
		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) {
				switch pgErr.Code {
				case "23503":
					applog.Warn(c, handlerDeleteBankAccount, "conflict",
						slog.Any(applog.AttrError, err))
					c.JSON(http.StatusConflict, types.APIResponse{
						Success: false,
						Message: "Cannot delete account with existing ledger entries",
						Code:    constants.BankAccountHasLedgerEntries,
					})
					return
				default:
					applog.Error(c, handlerDeleteBankAccount, "failed to process request",
						slog.Any(applog.AttrError, err),
					)
					c.JSON(http.StatusInternalServerError, types.APIResponse{
						Success: false,
						Message: "Failed to process requests",
						Code:    constants.InternalServerError,
					})
					return
				}
			}
			applog.Error(c, handlerDeleteBankAccount, "failed to process request",
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
			applog.Warn(c, handlerDeleteBankAccount, "resource not found")
			c.JSON(http.StatusNotFound, types.APIResponse{
				Success: false,
				Message: "Bank account not found",
				Code:    constants.BankAccountNotFound,
			})
			return
		}

		applog.Info(c, handlerDeleteBankAccount, "bank account deleted")
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Bank account deleted",
		})

	}
}
