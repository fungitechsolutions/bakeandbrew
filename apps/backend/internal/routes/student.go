package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/handlers/student"
	"github.com/suprimkhatri77/sms/backend/internal/middleware"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupStudentRoutes(router *gin.RouterGroup, cfg config.Config) {
	s := router.Group("/students")
	s.POST("/admission", middleware.RequireAuth(cfg.Config), middleware.RequireRole("student"), student.CreateStudent(cfg.StudentRepo, cfg.PgxPool))
	s.GET("/admission/status", middleware.RequireAuth(cfg.Config), middleware.RequireRole("student"), student.GetStudentAdmissionStatus(cfg.StudentRepo))
	s.POST("/inquiry", student.CreateInquiry(cfg.StudentRepo))
}
