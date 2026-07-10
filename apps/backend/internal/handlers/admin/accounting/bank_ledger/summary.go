package bankledger

import (
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	accountingRepository "github.com/suprimkhatri77/sms/backend/internal/repository/accounting"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerGetBankLedgerSummary = "GetBankLedgerSummary"

type GetBankLedgerSummaryParams struct {
	BankAccountID string `form:"account_id" binding:"omitempty,uuid"`
	BankID        string `form:"bank_id" binding:"omitempty,uuid"`
	FromDate      string `form:"from_date" binding:"omitempty,date_format"`
	ToDate        string `form:"to_date" binding:"omitempty,date_format"`
}

func GetBankLedgerSummary(queries accountingRepository.BankLedgerRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		var filter GetBankLedgerSummaryParams
		if err := c.ShouldBindQuery(&filter); err != nil {
			applog.Warn(c, handlerGetBankLedgerSummary, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid query parameters",
				Code:    constants.InvalidQueryParam,
			})
			return
		}

		var accountID pgtype.UUID
		if filter.BankAccountID != "" {
			id, err := utils.ConvertToUUID(filter.BankAccountID)
			if err != nil {
				applog.Warn(c, handlerGetBankLedgerSummary, "invalid request",
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusBadRequest, types.APIResponse{
					Success: false,
					Message: "Invalid account ID format",
					Code:    constants.InvalidIDFormat,
				})
				return
			}
			accountID = id
		}

		var bankID pgtype.UUID
		if filter.BankID != "" {
			id, err := utils.ConvertToUUID(filter.BankID)
			if err != nil {
				applog.Warn(c, handlerGetBankLedgerSummary, "invalid request",
					slog.Any(applog.AttrError, err))
				c.JSON(http.StatusBadRequest, types.APIResponse{
					Success: false,
					Message: "Invalid bank ID format",
					Code:    constants.InvalidIDFormat,
				})
				return
			}
			bankID = id
		}

		summary, err := queries.GetBankLedgerSummary(ctx, db.GetBankLedgerSummaryParams{
			BankAccountID: accountID,
			BankID:        bankID,
			FromDate:      utils.ToNullableDate(filter.FromDate),
			ToDate:        utils.ToNullableDate(filter.ToDate),
		})

		if err != nil {
			applog.Error(c, handlerGetBankLedgerSummary, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    summary,
		})

	}
}
