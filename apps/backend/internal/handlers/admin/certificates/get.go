package certificates

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

const handlerGetCertificate = "GetCertificate"

func GetCertificate(queries repository.CertificatesRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentID, err := utils.ConvertToUUID(c.Param("studentID"))
		if err != nil {
			applog.Warn(c, handlerGetCertificate, "invalid request",
				slog.Any(applog.AttrError, err))
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid request",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		certificate, err := queries.GetStudentCertificate(ctx, db.GetStudentCertificateParams{
			StudentID: studentID,
			Type:      "normal",
		})
		if err != nil {
			applog.Error(c, handlerGetCertificate, "failed to get student certificate",
				slog.Any(applog.AttrError, err))
			if errors.Is(err, pgx.ErrNoRows) {
				c.JSON(http.StatusOK, types.APIResponse{
					Success: true,
					Data:    nil,
					Message: "No certificate found",
				})
				return
			}
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to get student certificate",
				Code:    constants.InternalServerError,
			})
			return
		}

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Data:    certificate,
		})
	}
}
