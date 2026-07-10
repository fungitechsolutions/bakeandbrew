package certificates

import (
	"errors"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
)

const handlerGetCertificateDetails = "GetCertificateDetails"

func GetCertificateDetails(queries repository.CertificatesRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		certificateID := c.Param("certificateID")

		certificate, err := queries.GetCertificateDetails(ctx, certificateID)
		if err != nil {
			applog.Error(c, handlerGetCertificateDetails, "failed to get certificate details",
				slog.Any(applog.AttrError, err))
			if errors.Is(err, pgx.ErrNoRows) {
				c.JSON(http.StatusNotFound, types.APIResponse{
					Success: false,
					Message: "Certificate not found",
					Code:    constants.CertificateNotFound,
				})
				return
			}
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to get certificate details",
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
