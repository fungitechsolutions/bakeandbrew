package certificates

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jaevor/go-nanoid"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
	"github.com/suprimkhatri77/sms/backend/internal/validator"
)

type CreateCertificateRequest struct {
	Remarks string `json:"remarks" binding:"required"`
	Type    string `json:"type default=normal" binding:"omitempty,oneof=normal workshop"`
}

func generateCertificateID(length int) (string, error) {
	gen, err := nanoid.CustomASCII("abcdefghijklmnopqrstuvwxyz0123456789", length)
	if err != nil {
		return "", err
	}
	return gen(), nil
}

const handlerCreateCertificate = "CreateCertificate"

func CreateCertificate(queries repository.CertificatesRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		userID, err := utils.ConvertToUUID(c.MustGet("userID").(string))
		if err != nil {
			applog.Warn(c, handlerCreateCertificate, "invalid user ID",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid user ID",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		studentID, err := utils.ConvertToUUID(c.Param("studentID"))
		if err != nil {
			applog.Warn(c, handlerCreateCertificate, "invalid student ID",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid student ID",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		var req CreateCertificateRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			applog.Warn(c, handlerCreateCertificate, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request",
				Code:    constants.ValidationFailed,
				Errors:  validator.Parse(err, req),
			})
			return
		}

		if req.Type == "" {
			req.Type = "normal"
		}

		studentStatus, err := queries.GetStudentStatus(ctx, studentID)
		if err != nil {
			applog.Error(c, handlerCreateCertificate, "failed to get student by ID",
				slog.Any(applog.AttrError, err))
			if errors.Is(err, pgx.ErrNoRows) {
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Student not found",
					Code:    constants.StudentNotFound,
				})
				return
			}
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to get student by ID",
				Code:    constants.InternalServerError,
			})
			return
		}

		if studentStatus != "active" && studentStatus != "completed" {
			applog.Warn(c, handlerCreateCertificate, "cannot issue certificate for a student with pending or rejected status",
				slog.String(applog.AttrStudentStatus, studentStatus))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Cannot issue certificate for a student with pending or rejected status",
				Code:    constants.InvalidStudentStatus,
			})
			return
		}

		certificateExists, err := queries.CheckCertificateExists(ctx, db.CheckCertificateExistsParams{
			StudentID: studentID,
			Type:      req.Type,
		})
		if err != nil {
			applog.Error(c, handlerCreateCertificate, "failed to check certificate exists",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to check certificate exists",
				Code:    constants.InternalServerError,
			})
			return
		}
		if certificateExists {
			applog.Warn(c, handlerCreateCertificate, "certificate already exists",
				slog.String(applog.AttrCertificateType, req.Type))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Certificate already exists",
				Code:    constants.CertificateAlreadyExists,
			})
			return
		}

		certificateID, err := generateCertificateID(14)
		if err != nil {
			applog.Error(c, handlerCreateCertificate, "failed to generate certificate ID",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to generate certificate ID",
				Code:    constants.InternalServerError,
			})
			return
		}
		certificate, err := queries.IssueCertificate(ctx, db.IssueCertificateParams{
			ID:        certificateID,
			StudentID: studentID,
			IssuedBy:  userID,
			Remarks:   utils.ToNullableText(req.Remarks),
			Type:      req.Type,
		})
		if err != nil {
			applog.Error(c, handlerCreateCertificate, "failed to issue certificate",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to issue certificate",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusCreated, types.APIResponse{
			Success: true,
			Message: "Certificate record created",
			Data:    certificate,
		})
	}
}
