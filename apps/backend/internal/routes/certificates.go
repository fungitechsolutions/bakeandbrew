package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/handlers/certificates"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupCertificatesRoutes(router *gin.RouterGroup, cfg config.Config) {
	router.GET("/certificates/:certificateID", certificates.GetCertificateDetails(cfg.Queries))
}
