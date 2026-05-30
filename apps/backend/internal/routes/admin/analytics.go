package admin

import (
	"github.com/gin-gonic/gin"
	adminAnalytics "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/analytics"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupAdminAnalyticsRoutes(admin *gin.RouterGroup, cfg config.Config) {
	admin.GET("/analytics", adminAnalytics.GetAnalytics(cfg.Queries))
}
