package admin

import (
	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/handlers/admin/certificates"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupAdminCertificatesRoutes(admin *gin.RouterGroup, cfg config.Config) {

	admin.POST("/certificates/:studentID", certificates.CreateCertificate(cfg.Queries))
}
