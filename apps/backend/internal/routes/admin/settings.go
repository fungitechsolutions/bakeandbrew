package admin

import (
	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/handlers/admin/settings"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupAdminSettingsRoutes(admin *gin.RouterGroup, cfg config.Config) {
	admin.GET("/settings", settings.GetSettings(cfg.Queries))
	admin.PUT("/settings/:key", settings.UpdateSetting(cfg.Queries))
}
