package scholarship

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

func ListStudentScholarshipDetail(queries repository.StudentsScholarship) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFromParam := c.Param("studentID")
		if studentIDFromParam == "" {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Missing student ID",
				Code:    constants.MissingStudentID,
			})
			return
		}

		studentID, err := utils.ConvertToUUID(studentIDFromParam)
		if err != nil {
			applog.Error(c, "ListStudentScholarshipDetail", "invalid student id format",
				slog.String("student_id_raw", studentIDFromParam),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		scholarship, err := queries.GetScholarshipByStudent(ctx, studentID)
		if err != nil {
			if errors.Is(err, pgx.ErrNoRows) {
				c.JSON(http.StatusOK, types.APIResponse{
					Success: true,
					Message: "No scholarship found",
					Data:    nil,
				})
				return
			}
			applog.Error(c, "ListStudentScholarshipDetail", "failed to fetch scholarship",
				applog.WithStudentID(studentIDFromParam),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    scholarship,
		})
	}
}

type ListAllStudentScholarshipsParams struct {
	Page   int    `form:"page,default=1" binding:"required,min=1"`
	From   string `form:"from" binding:"omitempty,date_format"`
	To     string `form:"to" binding:"omitempty,date_format"`
	Search string `form:"search" binding:"omitempty,min=1,max=100"`
}

type ListAllStudentScholarshipsResponse struct {
	Scholarships      []db.GetAllStudentScholarshipsRow `json:"scholarships"`
	TotalScholarships int64                             `json:"totalScholarships"`
}

const handlerListAllStudentScholarships = "ListAllStudentScholarships"

func ListAllStudentScholarships(queries repository.AdminRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		pageLimit := 50

		var params ListAllStudentScholarshipsParams
		if err := c.ShouldBindQuery(&params); err != nil {
			applog.Warn(c, handlerListAllStudentScholarships, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid query parameter",
				Code:    constants.InvalidQueryParam,
			})
			return
		}

		total, err := queries.GetAllStudentScholarshipsCount(ctx, db.GetAllStudentScholarshipsCountParams{
			From:   utils.ToNullableText(params.From),
			To:     utils.ToNullableText(params.To),
			Search: utils.ToNullableText(params.Search),
		})
		if err != nil {
			applog.Error(c, handlerListAllStudentScholarships, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		if total == 0 {
			if params.Page > 1 {
				c.JSON(http.StatusBadRequest, types.APIResponse{
					Success: false,
					Message: "Page not found",
					Code:    constants.InvalidQueryParam,
				})
				return
			}

			c.JSON(http.StatusOK, types.APIResponse{
				Success: true,
				Data: ListAllStudentScholarshipsResponse{
					Scholarships:      []db.GetAllStudentScholarshipsRow{},
					TotalScholarships: 0,
				},
				Meta: &types.PaginationMeta{
					Total:      int(total),
					TotalPages: 0,
					Limit:      pageLimit,
					Page:       params.Page,
				},
			})
			return
		}
		totalPages := (int(total) + pageLimit - 1) / pageLimit
		if params.Page > int(totalPages) {
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Page not found",
				Code:    constants.InvalidQueryParam,
			})
			return
		}
		offset := pageLimit * (params.Page - 1)

		scholarships, err := queries.GetAllStudentScholarships(ctx, db.GetAllStudentScholarshipsParams{
			Limit:  int32(pageLimit),
			Offset: int32(offset),
			From:   utils.ToNullableText(params.From),
			To:     utils.ToNullableText(params.To),
			Search: utils.ToNullableText(params.Search),
		})
		if err != nil {
			applog.Error(c, handlerListAllStudentScholarships, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		totalScholarships, err := queries.GetAllStudentScholarshipsTotal(ctx, db.GetAllStudentScholarshipsTotalParams{
			From:   utils.ToNullableText(params.From),
			To:     utils.ToNullableText(params.To),
			Search: utils.ToNullableText(params.Search),
		})
		if err != nil {
			applog.Error(c, handlerListAllStudentScholarships, "failed to process request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to process request",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data: ListAllStudentScholarshipsResponse{
				Scholarships:      scholarships,
				TotalScholarships: totalScholarships,
			},
			Meta: &types.PaginationMeta{
				Total:      int(total),
				TotalPages: int(totalPages),
				Page:       params.Page,
				Limit:      pageLimit,
			},
		})
	}
}
