package out

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

type ListStockOutParams struct {
	From       string `form:"from"`
	To         string `form:"to"`
	Search     string `form:"search"`
	SortByRate string `form:"sort_by_rate"`
}

func ListStockOut(queries repository.InventoryRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		const LIMIT = 20

		var filter ListStockOutParams
		if err := c.ShouldBindQuery(&filter); err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid query parameters",
				Code:    constants.InvalidQueryParam,
			})
			return
		}

		page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
		if err != nil || page <= 0 {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid query parameter",
				Code:    constants.InvalidQueryParam,
			})
			return
		}

		total, err := queries.GetStockOutCount(ctx, db.GetStockOutCountParams{
			Search: utils.ToNullableText(filter.Search),
			From:   utils.ToNullableText(filter.From),
			To:     utils.ToNullableText(filter.To),
		})
		if err != nil {
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
				Data:    []db.ListStockOutRow{},
				Meta: &types.PaginationMeta{
					Total:      int(total),
					Limit:      LIMIT,
					TotalPages: 0,
					Page:       page,
				},
			})
			return
		}

		totalPages := (total + LIMIT - 1) / LIMIT
		if page > int(totalPages) {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid page parameter value",
				Code:    constants.InvalidPageParam,
			})
			return
		}

		offset := LIMIT * (page - 1)

		stockOutList, err := queries.ListStockOut(ctx, db.ListStockOutParams{
			Limit:      LIMIT,
			Offset:     int32(offset),
			Search:     utils.ToNullableText(filter.Search),
			From:       utils.ToNullableText(filter.From),
			To:         utils.ToNullableText(filter.To),
			SortByRate: utils.ToNullableText(filter.SortByRate),
		})

		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if len(stockOutList) == 0 {
			stockOutList = []db.ListStockOutRow{}
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    stockOutList,
			Meta: &types.PaginationMeta{
				Total:      int(total),
				TotalPages: int(totalPages),
				Page:       page,
				Limit:      LIMIT,
			},
		})

	}
}
