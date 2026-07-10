package in

import (
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerDeleteStockIn = "DeleteStockIn"

func DeleteStockIn(queries repository.InventoryRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		stockIDFromParam := c.Param("stockID")
		if stockIDFromParam == "" {
			applog.Warn(c, handlerDeleteStockIn, "invalid request")
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing stock ID",
				Code:    constants.MissingStockID,
			})
			return
		}

		stockID, err := utils.ConvertToUUID(stockIDFromParam)
		if err != nil {
			applog.Warn(c, handlerDeleteStockIn, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid stock ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		err = queries.DeleteStockIn(ctx, stockID)
		if err != nil {
			applog.Error(c, handlerDeleteStockIn, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		applog.Info(c, handlerDeleteStockIn, "stock deleted")
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Stock deleted",
		})
	}
}
