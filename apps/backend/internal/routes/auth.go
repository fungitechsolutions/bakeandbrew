package routes

import (
	"github.com/gin-gonic/gin"
	authHandler "github.com/suprimkhatri77/sms/backend/internal/handlers/auth"
	"github.com/suprimkhatri77/sms/backend/internal/middleware"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupAuthRoutes(router *gin.RouterGroup, cfg config.Config) {
	auth := router.Group("/auth")
	auth.POST("/login", authHandler.Login(cfg.Queries, cfg.Config))
	auth.POST("/signup", authHandler.Signup(cfg.Queries, cfg.Config))
	auth.POST("/logout", authHandler.Logout(cfg.Queries, cfg.Config))
	auth.POST("/refresh", authHandler.RotateTokens(cfg.Queries, cfg.Config))
	auth.POST("/bootstrap", authHandler.Bootstrap(cfg.Queries, cfg.Config))
	auth.GET("/me", middleware.RequireAuth(cfg.Config), middleware.RequireRole("admin", "superadmin", "student"), authHandler.Me(cfg.Queries))
}
