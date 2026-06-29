package summary

import (
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerGetInventorySummary = "GetInventorySummary"

type GetInventorySummaryParams struct {
	From string `form:"from"`
	To   string `form:"to"`
}

func GetInventorySummary(queries repository.InventoryRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		var filter GetInventorySummaryParams
		if err := c.ShouldBindQuery(&filter); err != nil {
			applog.Warn(c, handlerGetInventorySummary, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid query parameters",
				Code:    constants.InvalidQueryParam,
			})
			return
		}

		summary, err := queries.GetInventorySummary(ctx, db.GetInventorySummaryParams{
			From: utils.ToNullableText(filter.From),
			To:   utils.ToNullableText(filter.To),
		})
		if err != nil {
			applog.Error(c, handlerGetInventorySummary, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to get inventory summary",
				Code:    constants.InternalServerError,
			})
			return
		}

		if len(summary) == 0 {
			summary = []db.GetInventorySummaryRow{}
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    summary,
		})

	}
}
