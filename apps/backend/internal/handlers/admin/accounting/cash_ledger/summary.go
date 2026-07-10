package cashledger

import (
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	accountingRepository "github.com/suprimkhatri77/sms/backend/internal/repository/accounting"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerGetCashLedgerSummary = "GetCashLedgerSummary"

type GetCashLedgerSummaryParams struct {
	FromAD string `form:"from_ad"`
	ToAD   string `form:"to_ad"`
}

func GetCashLedgerSummary(queries accountingRepository.CashLedgerRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		var filter GetCashLedgerSummaryParams
		if err := c.ShouldBindQuery(&filter); err != nil {
			applog.Warn(c, handlerGetCashLedgerSummary, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid query parameters",
				Code:    constants.InvalidQueryParam,
			})
			return
		}

		summary, err := queries.GetCashLedgerSummary(ctx, db.GetCashLedgerSummaryParams{
			FromDate: utils.ToNullableDate(filter.FromAD),
			ToDate:   utils.ToNullableDate(filter.ToAD),
		})

		if err != nil {
			applog.Error(c, handlerGetCashLedgerSummary, "failed to process request",
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
