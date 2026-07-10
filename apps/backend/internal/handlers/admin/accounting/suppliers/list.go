package suppliers

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	accountingRepository "github.com/suprimkhatri77/sms/backend/internal/repository/accounting"
	"github.com/suprimkhatri77/sms/backend/internal/types"
)

const handlerListSuppliers = "ListSuppliers"

func ListSuppliers(queries accountingRepository.SuppliersRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		const PAGE_LIMIT = 20

		page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
		if err != nil {
			applog.Warn(c, handlerListSuppliers, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid query parameter",
				Code:    constants.InvalidQueryParam,
			})
			return
		}

		if page <= 0 {
			applog.Warn(c, handlerListSuppliers, "invalid request")
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Page must be greater than 0",
				Code:    constants.InvalidQueryParam,
			})
			return
		}

		total, err := queries.GetSupplierCount(ctx)
		if err != nil {
			applog.Error(c, handlerListSuppliers, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}
		if total == 0 {
			c.JSON(http.StatusOK, types.APIResponse{
				Success: true,
				Data:    []db.Supplier{},
				Meta: types.PaginationMeta{
					Total:      0,
					TotalPages: 0,
					Limit:      PAGE_LIMIT,
					Page:       page,
				},
			})
			return
		}

		totalPages := (total + PAGE_LIMIT - 1) / PAGE_LIMIT
		if page > int(totalPages) {
			applog.Warn(c, handlerListSuppliers, "invalid request")
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid page parameter",
				Code:    constants.InvalidQueryParam,
			})
			return
		}

		offset := (page - 1) * PAGE_LIMIT

		suppliers, err := queries.ListSuppliers(ctx, db.ListSuppliersParams{
			Limit:  PAGE_LIMIT,
			Offset: int32(offset),
		})
		if err != nil {
			applog.Error(c, handlerListSuppliers, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if len(suppliers) == 0 {
			suppliers = []db.Supplier{}
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    suppliers,
			Meta: types.PaginationMeta{
				Total:      int(total),
				TotalPages: int(totalPages),
				Page:       page,
				Limit:      PAGE_LIMIT,
			},
		})

	}
}
