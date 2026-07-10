package supplierledger

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

const handlerGetSupplierLedgerSummary = "GetSupplierLedgerSummary"

type GetSupplierLedgerSummaryParams struct {
	SupplierID string `form:"supplier_id"`
	FromDate   string `form:"from_date"`
	ToDate     string `form:"to_date"`
}

func GetSupplierLedgerSummary(queries accountingRepository.SupplierLedgerRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		const PAGE_LIMIT = 40

		var filters ListSupplierLedgerParams
		if err := c.ShouldBindQuery(&filters); err != nil {
			applog.Warn(c, handlerGetSupplierLedgerSummary, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid query parameter",
				Code:    constants.InvalidQueryParam,
			})
			return
		}

		summary, err := queries.GetSupplierLedgerSummary(ctx, db.GetSupplierLedgerSummaryParams{
			SupplierID: utils.ToNullableUUID(filters.SupplierID),
			FromDate:   utils.ToNullableDate(filters.FromDate),
			ToDate:     utils.ToNullableDate(filters.ToDate),
		})

		if err != nil {
			applog.Error(c, handlerGetSupplierLedgerSummary, "failed to process request",
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
