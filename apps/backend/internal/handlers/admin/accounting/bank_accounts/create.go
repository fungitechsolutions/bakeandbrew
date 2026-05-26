package bankaccounts

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

type CreateBankAccountRequest struct {
	AccountName   string `json:"accountName" binding:"required,notblank,min=2,max=100"`
	AccountNumber string `json:"accountNumber" binding:"omitempty,notblank,min=1,max=100"`
}

func CreateBankAccount(queries accountingRepository.BankAccountRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		bankIDFromParam := c.Param("bankID")

		bankID, err := utils.ConvertToUUID(bankIDFromParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		var req CreateBankAccountRequest
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

		account, err := queries.CreateBankAccount(ctx, db.CreateBankAccountParams{
			AccountName:   req.AccountName,
			AccountNumber: utils.ToNullableText(req.AccountNumber),
			BankID:        bankID,
		})

		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) {

				switch pgErr.Code {

				case "23503":

					c.JSON(http.StatusNotFound, types.APIResponse{
						Success: false,
						Message: "Bank not found",
						Code:    constants.BankNotFound,
					})
					return
				case "23505":
					switch pgErr.ConstraintName {
					case "bank_accounts_bank_id_account_name_key":
						c.JSON(http.StatusConflict, types.APIResponse{
							Success: false,
							Message: "Account with that name already exists",
							Code:    constants.BankAccountAlreadyExists,
						})

						return
					case "idx_bank_accounts_single_default":
						c.JSON(http.StatusConflict, types.APIResponse{
							Success: false,
							Message: "Only one account can be default at a time",
							Code:    constants.DefaultBankAccountAlreadyExists,
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
			Message: "Bank account created",
			Data:    account,
		})
	}
}
