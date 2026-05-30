package supplierledger

import (
	"errors"
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

type CreateSupplierLedgerEntryRequest struct {
	Date        string  `json:"date" binding:"required,date_format"`
	BsDate      string  `json:"bsDate" binding:"required,bs_date"`
	EntryType   string  `json:"entryType" binding:"required,oneof=cr dr"`
	Amount      float64 `json:"amount" binding:"required,gt=0,lte=10000000"`
	Description string  `json:"description" binding:"omitempty,notblank,min=5,max=200"`
	StockInID   string  `json:"stockInID" binding:"omitempty,uuid"`
}

func CreateSupplierLedgerEntry(queries accountingRepository.SupplierLedgerRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		supplierIDFromParam := c.Param("supplierID")
		supplierID, err := utils.ConvertToUUID(supplierIDFromParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing supplier ID",
				Code:    constants.MissingSupplierID,
			})
			return
		}

		var req CreateSupplierLedgerEntryRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request body",
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

		_, err = queries.CreateSupplierLedgerEntry(ctx, db.CreateSupplierLedgerEntryParams{
			SupplierID:  supplierID,
			Date:        pgtype.Timestamptz{Time: adDate, Valid: true},
			BsDate:      req.BsDate,
			StockInID:   utils.ToNullableUUID(req.StockInID),
			Description: utils.ToNullableText(req.Description),
			Amount:      int64(req.Amount * 100),
			EntryType:   req.EntryType,
		})

		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) {
				switch pgErr.Code {
				case "23503":
					switch pgErr.ConstraintName {
					case "supplier_ledger_stock_in_id_fkey":
						c.JSON(http.StatusNotFound, types.APIResponse{
							Success: false,
							Message: "Stock not found",
							Code:    constants.StockNotFound,
						})
						return
					case "supplier_ledger_supplier_id_fkey":
						c.JSON(http.StatusNotFound, types.APIResponse{
							Success: false,
							Message: "Supplier not found",
							Code:    constants.SupplierNotFound,
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

		}

		c.JSON(http.StatusCreated, types.APIResponse{
			Success: true,
			Message: "Ledger entry created",
		})
	}
}
