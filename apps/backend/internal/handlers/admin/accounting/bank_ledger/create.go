package bankledger

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	accountingRepository "github.com/suprimkhatri77/sms/backend/internal/repository/accounting"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
	"github.com/suprimkhatri77/sms/backend/internal/validator"
)

type CreateBankLedgerEntryRequest struct {
	Date        string  `json:"date" binding:"required,date_format"`
	BsDate      string  `json:"bsDate" binding:"required,bs_date"`
	EntryType   string  `json:"entryType" binding:"required,oneof=cr dr"`
	Amount      float64 `json:"amount" binding:"required,gt=0,lte=10000000"`
	Description string  `json:"description" binding:"omitempty,notblank,min=5,max=200"`
	PaymentID   string  `json:"paymentID" binding:"omitempty,uuid"`
}

func CreateBankLedgerEntry(queries accountingRepository.BankLedgerRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		accountIDFromParam := c.Param("accountID")

		accountID, err := utils.ConvertToUUID(accountIDFromParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		var req CreateBankLedgerEntryRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			log.Println("error: ", err)
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request data",
				Code:    constants.ValidationFailed,
				Errors:  validator.Parse(err, req),
			})
			return
		}

		utils.TrimStruct(&req)

		adDate, err := time.Parse("2006-01-02", req.Date)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid date format",
				Code:    constants.ValidationFailed,
			})
			return
		}

		entry, err := queries.CreateBankLedgerEntry(ctx, db.CreateBankLedgerEntryParams{
			BankAccountID: accountID,
			Amount:        int64(req.Amount * 100),
			EntryType:     req.EntryType,
			Description:   utils.ToNullableText(req.Description),
			BsDate:        req.BsDate,
			Date:          pgtype.Timestamptz{Time: adDate, Valid: true},
		})

		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) {
				switch pgErr.Code {
				case "23503":
					switch pgErr.ConstraintName {
					case "bank_ledger_bank_account_id_fkey":
						c.JSON(http.StatusNotFound, types.APIResponse{
							Success: false,
							Message: "Bank account not found",
							Code:    constants.BankAccountNotFound,
						})
						return
					case "bank_ledger_payment_id_fkey":
						c.JSON(http.StatusNotFound, types.APIResponse{
							Success: false,
							Message: "Payment not found",
							Code:    constants.PaymentNotFound,
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
				case "23514":
					switch pgErr.ConstraintName {
					case "bank_ledger_entry_type_check":
						c.JSON(http.StatusBadRequest, types.APIResponse{
							Success: false,
							Message: "Entry type must be one of cr or dr",
							Code:    constants.ValidationFailed,
						})
						return
					case "bank_ledger_amount_check":
						c.JSON(http.StatusBadRequest, types.APIResponse{
							Success: false,
							Message: "Ledger amount must be greater than 0",
							Code:    constants.ValidationFailed,
						})
						return
					default:
						c.JSON(http.StatusInternalServerError, types.APIResponse{
							Success: false,
							Message: "Failed to process request",
							Code:    constants.ValidationFailed,
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
			Message: "Ledger entry created",
			Data:    entry,
		})

	}
}
