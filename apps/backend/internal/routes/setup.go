package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	upload "github.com/suprimkhatri77/sms/backend/internal/handlers/uploads"
	"github.com/suprimkhatri77/sms/backend/internal/middleware"
	"github.com/suprimkhatri77/sms/backend/internal/routes/admin"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
	"github.com/suprimkhatri77/sms/backend/internal/types"
)

func Setup(r *gin.Engine, cfg config.Config) {
	router := r.Group("/api/v1")

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Server is up and running",
		})
	})

	router.POST("/uploads", middleware.RequireAuth(cfg.Config), middleware.RequireRole("student", "admin", "superadmin"), upload.Upload(cfg.CldClient))

	setupAuthRoutes(router, cfg)
	admin.SetupAdminRoutes(router, cfg)
	setupStudentRoutes(router, cfg)
	setupPortalRoutes(router, cfg)
	setupCourseRoutes(router, cfg)
}
