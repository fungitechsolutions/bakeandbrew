package admin

import (
	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/handlers/admin/profile"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupAdminProfileRoutes(admin *gin.RouterGroup, cfg config.Config) {
	admin.PUT("/profile/update-password", profile.UpdatePassword(cfg.Queries))
	admin.PUT("/profile/update-profile", profile.UpdateProfile(cfg.Queries))
}
