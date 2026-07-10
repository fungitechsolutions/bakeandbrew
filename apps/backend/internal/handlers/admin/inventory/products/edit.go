package products

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
	"github.com/suprimkhatri77/sms/backend/internal/validator"
)

const handlerEditProduct = "EditProduct"

func EditProduct(queries repository.InventoryRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		productIDFromParams := c.Param("productID")
		if productIDFromParams == "" {
			applog.Warn(c, handlerEditProduct, "invalid request")
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing product ID",
				Code:    constants.MissingProductID,
			})
			return
		}

		productID, err := utils.ConvertToUUID(productIDFromParams)
		if err != nil {
			applog.Warn(c, handlerEditProduct, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid product ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		var req types.UpdateProductRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			applog.Warn(c, handlerEditProduct, "invalid request",
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

		_, err = queries.UpdateProduct(ctx, db.UpdateProductParams{
			ID:   productID,
			Name: req.Name,
			Unit: req.Unit,
		})

		if err != nil {
			applog.Error(c, handlerEditProduct, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
		}

		applog.Info(c, handlerEditProduct, "product updated")
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Product updated",
		})
	}
}
