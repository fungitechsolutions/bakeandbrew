package banks

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	accountingRepository "github.com/suprimkhatri77/sms/backend/internal/repository/accounting"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

func DeleteBank(queries accountingRepository.BankRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		bankIDFromParam := c.Param("bankID")
		if bankIDFromParam == "" {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing bank ID",
				Code:    constants.MissingBankID,
			})
			return
		}

		bankID, err := utils.ConvertToUUID(bankIDFromParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return

		}

		bank, err := queries.GetBankByID(ctx, bankID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Bank not found",
					Code:    constants.BankNotFound,
				})
				return
			}
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if bank.IsDefault {
			c.JSON(http.StatusConflict, types.APIResponse{
				Success: false,
				Message: "Cannot delete default bank. Set another bank as default first.",
				Code:    constants.CannotDeleteDefaultBank,
			})
			return
		}

		result, err := queries.DeleteBank(ctx, bankID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return

		}

		if result.RowsAffected() == 0 {
			c.JSON(http.StatusNotFound, types.APIResponse{
				Success: false,
				Message: "Bank not found",
				Code:    constants.BankNotFound,
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Bank deleted",
		})
	}
}
