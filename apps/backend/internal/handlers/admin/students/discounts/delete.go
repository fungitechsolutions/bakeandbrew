package discount

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

const handlerDeleteDiscount = "DeleteDiscount"

func DeleteDiscount(queries repository.StudentDiscounts) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		discountIDFromParam := c.Param("discountID")
		if discountIDFromParam == "" {
			applog.Warn(c, handlerDeleteDiscount, "invalid request",
				slog.String("discountID_raw", discountIDFromParam))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing student discount ID",
				Code:    constants.MissingStudentDiscountID,
			})
			return
		}

		discountID, err := utils.ConvertToUUID(discountIDFromParam)
		if err != nil {
			applog.Warn(c, handlerDeleteDiscount, "invalid request",
				slog.String("discountID_raw", discountIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		err = queries.DeleteDiscount(ctx, discountID)
		if err != nil {
			applog.Error(c, handlerDeleteDiscount, "failed to process request",
				slog.String("discountID_raw", discountIDFromParam),
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to delete discount data",
				Code:    constants.InternalServerError,
			})
			return
		}

		applog.Info(c, handlerDeleteDiscount, "discount data deleted",
			slog.String("discountID_raw", discountIDFromParam))
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Discount data deleted",
		})
	}
}
