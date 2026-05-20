package studentPortal

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

type GetStudentFeeSummaryDataResponse struct {
	TotalFee     int64 `json:"totalFee"`
	TotalPaid    int64 `json:"totalPaid"`
	Remaining    int64 `json:"remaining"`
	CoursesCount int64 `json:"coursesCount"`
}

func GetStudentFeeSummary(queries repository.StudentPortal) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFromContext := c.MustGet("userID").(string)
		studentID, err := utils.ConvertToUUID(studentIDFromContext)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		id, err := queries.GetStudentID(ctx, studentID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		coursesCount, err := queries.GetStudentCoursesCount(ctx, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		summary, err := queries.GetStudentFeeSummary(ctx, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		remaining := summary.TotalFee - summary.TotalPaid - summary.TotalDiscountAmount - summary.ScholarshipAmount

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data: GetStudentFeeSummaryDataResponse{
				TotalFee:     summary.TotalFee,
				TotalPaid:    summary.TotalPaid,
				Remaining:    remaining,
				CoursesCount: coursesCount,
			},
		})

	}
}

func GetStudentPayments(queries repository.StudentPortal) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		studentIDFromContext := c.MustGet("userID").(string)
		studentID, err := utils.ConvertToUUID(studentIDFromContext)
		if err != nil {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		id, err := queries.GetStudentID(ctx, studentID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		payments, err := queries.GetStudentPayments(ctx, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if len(payments) == 0 {
			payments = []db.GetStudentPaymentsRow{}
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    payments,
		})

	}
}
