package suppliers

import (
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	accountingRepository "github.com/suprimkhatri77/sms/backend/internal/repository/accounting"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerDeleteSupplier = "DeleteSupplier"

func DeleteSupplier(queries accountingRepository.SuppliersRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		supplierIDFromParam := c.Param("supplierID")
		supplierID, err := utils.ConvertToUUID(supplierIDFromParam)
		if err != nil {
			applog.Warn(c, handlerDeleteSupplier, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		result, err := queries.DeleteSupplier(ctx, supplierID)
		if err != nil {
			applog.Error(c, handlerDeleteSupplier, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if result.RowsAffected() == 0 {
			applog.Warn(c, handlerDeleteSupplier, "resource not found")
			c.JSON(http.StatusNotFound, types.APIResponse{
				Success: false,
				Message: "Supplier not found",
				Code:    constants.SupplierNotFound,
			})
			return
		}

		applog.Info(c, handlerDeleteSupplier, "supplier deleted")
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Supplier deleted",
		})
	}
}
