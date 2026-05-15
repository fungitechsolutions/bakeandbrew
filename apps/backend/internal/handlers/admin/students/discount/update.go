package discount

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
	"github.com/suprimkhatri77/sms/backend/internal/validator"
)

type UpdateDiscountRequest struct {
	StudentID string  `json:"studentID" binding:"required,uuid"`
	Type      string  `json:"type" binding:"required,min=1,max=50"`
	Note      string  `json:"note" binding:"omitempty,min=1,max=100"`
	Percent   float64 `json:"percent" binding:"required,gt=0"`
}

func UpdateDiscount(queries repository.StudentDiscounts) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		discountIDFromParam := c.Param("discountID")
		if discountIDFromParam == "" {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing student discount ID",
				Code:    constants.MissingStudentDiscountID,
			})
			return
		}

		discountID, err := utils.ConvertToUUID(discountIDFromParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		var req UpdateDiscountRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request data",
				Errors:  validator.Parse(err, req),
				Code:    constants.ValidationFailed,
			})
			return
		}

		utils.TrimStruct(&req)

		studentID, err := utils.ConvertToUUID(req.StudentID)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		summary, err := queries.GetStudentFeeSummary(ctx, studentID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		effectiveFee := summary.TotalFee

		discountPercent, err := utils.NumericToFloat64(summary.TotalDiscountPercent)
		if err != nil {
			slog.Error("failed to convert discount percent",
				"error", err,
				"path", c.FullPath(),
				"ip", c.ClientIP(),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		scholarshipPercent, err := utils.NumericToFloat64(summary.ScholarshipPercent)
		if err != nil {
			slog.Error("failed to convert scholarship percent",
				"error", err,
				"path", c.FullPath(),
				"ip", c.ClientIP(),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		discountAmount := int64(float64(effectiveFee) * discountPercent / 100)
		scholarshipAmount := int64(float64(effectiveFee) * scholarshipPercent / 100)
		alreadyCovered := summary.TotalPaid + discountAmount + scholarshipAmount

		if alreadyCovered >= effectiveFee {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "No outstanding balance remaining for this student",
				Code:    constants.ValidationFailed,
			})
			return
		}

		newDiscountAmount := effectiveFee * int64(req.Percent) / 100

		if alreadyCovered+newDiscountAmount > effectiveFee {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Discount exceeds outstanding balance",
				Code:    constants.ValidationFailed,
			})
			return
		}

		percent, err := utils.ToNumeric(req.Percent)
		if err != nil {
			slog.Error("failed to convert percent",
				"error", err,
				"path", c.FullPath(),
				"ip", c.ClientIP(),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		_, err = queries.UpdateDiscount(ctx, db.UpdateDiscountParams{
			ID:      discountID,
			Note:    utils.ToNullableText(req.Note),
			Type:    req.Type,
			Percent: percent,
		})

		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "23503" {
				c.JSON(http.StatusConflict, types.APIResponse{
					Success: false,
					Message: "Student not found",
					Code:    constants.StudentNotFound,
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

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Student discount data updated",
		})
	}
}
