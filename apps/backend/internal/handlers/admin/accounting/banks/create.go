package banks

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	accountingRepository "github.com/suprimkhatri77/sms/backend/internal/repository/accounting"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
	"github.com/suprimkhatri77/sms/backend/internal/validator"
)

type CreateBankRequest struct {
	Name      string `json:"name" binding:"required,notblank,min=2,max=100"`
	IsDefault *bool  `json:"isDefault" binding:"required"`
}

func CreateBank(queries accountingRepository.BankRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		var req CreateBankRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request data",
				Code:    constants.ValidationFailed,
				Errors:  validator.Parse(err, req),
			})
			return
		}

		utils.TrimStruct(&req)

		bank, err := queries.CreateBank(ctx, db.CreateBankParams{
			Name:      req.Name,
			IsDefault: *req.IsDefault,
		})

		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "23505" {
				switch pgErr.ConstraintName {
				case "idx_banks_single_default":
					c.JSON(http.StatusConflict, types.APIResponse{
						Success: false,
						Message: "Only one bank can be set as default",
						Code:    constants.DefaultBankAlreadyExists,
					})
					return
				case "banks_name_key":
					c.JSON(http.StatusConflict, types.APIResponse{
						Success: false,
						Message: "Bank with this name already exists",
						Code:    constants.BankAlreadyExists,
					})
					return
				default:
					c.JSON(http.StatusInternalServerError, types.APIResponse{
						Success: false,
						Message: "Failed to process request",
						Code:    constants.InternalServerError,
					})
					return
				}

			}

			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusCreated, types.APIResponse{
			Success: true,
			Message: "Bank created",
			Data:    bank,
		})
	}
}
