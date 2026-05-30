package admin

import (
	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/middleware"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func SetupAdminRoutes(router *gin.RouterGroup, cfg config.Config) {
	admin := router.Group("/admin", middleware.RequireAuth(cfg.Config), middleware.RequireRole("admin", "superadmin"))

	setupAdminUserRoutes(admin, cfg)
	setupAdminStudentRoutes(admin, cfg)
	setupAdminCourseRoutes(admin, cfg)
	setupAdminSettingsRoutes(admin, cfg)
	setupAdminInquiryRoutes(admin, cfg)
	setupAdminAnalyticsRoutes(admin, cfg)
	setupAdminInventoryRoutes(admin, cfg)
	setupAdminAccountingRoutes(admin, cfg)
}
