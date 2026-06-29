package students

import (
	"log/slog"
	"net/http"

	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
)

const handlerGetDistinctBatches = "GetDistinctBatches"

func GetDistinctBatches(queries repository.AdminRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		batches, err := queries.GetDistinctBatches(ctx)
		if err != nil {
			applog.Error(c, handlerGetDistinctBatches, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to fetch student batches",
				Code:    constants.InternalServerError,
			})
			return
		}

		if len(batches) == 0 {
			batches = []pgtype.Text{}
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    batches,
		})
	}
}
