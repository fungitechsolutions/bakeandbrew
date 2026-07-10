package wastage

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

const handlerDeleteWastage = "DeleteWastage"

func DeleteWastage(queries repository.InventoryRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		wastageIDFromParam := c.Param("wastageID")
		if wastageIDFromParam == "" {
			applog.Warn(c, handlerDeleteWastage, "invalid request")
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing wastage ID",
				Code:    constants.MissingWastageID,
			})
			return
		}

		wastageID, err := utils.ConvertToUUID(wastageIDFromParam)
		if err != nil {
			applog.Warn(c, handlerDeleteWastage, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid wastage ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		err = queries.DeleteWastage(ctx, wastageID)
		if err != nil {
			applog.Error(c, handlerDeleteWastage, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		applog.Info(c, handlerDeleteWastage, "wastage stock deleted")
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Wastage stock deleted",
		})
	}
}
