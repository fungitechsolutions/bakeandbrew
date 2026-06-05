package students

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
)

func GetDistinctBatches(queries repository.AdminRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		batches, err := queries.GetDistinctBatches(ctx)
		if err != nil {
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
