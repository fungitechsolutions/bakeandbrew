package routes

import (
	"github.com/gin-gonic/gin"
	studentPortal "github.com/suprimkhatri77/sms/backend/internal/handlers/student_portal"
	"github.com/suprimkhatri77/sms/backend/internal/middleware"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupPortalRoutes(router *gin.RouterGroup, cfg config.Config) {
	p := router.Group("/portal/student", middleware.RequireAuth(cfg.Config), middleware.RequireRole("student"))
	p.GET("/overview", studentPortal.GetStudentOverview(cfg.Queries))
	p.GET("/courses", studentPortal.GetStudentCourses(cfg.Queries))
	p.GET("/payments", studentPortal.GetStudentPayments(cfg.Queries))
	p.GET("/fee/summary", studentPortal.GetStudentFeeSummary(cfg.Queries))
	p.GET("/status", studentPortal.GetStudentStatusByUserID(cfg.Queries))
	p.GET("/pending-overview", studentPortal.GetStudentPendingOverview(cfg.Queries))
	p.GET("/rejected-overview", studentPortal.GetStudentRejectedOverview(cfg.Queries))
	p.GET("/discounts", studentPortal.GetStudentDiscounts(cfg.Queries))
	p.GET("/scholarship", studentPortal.GetStudentScholarship(cfg.Queries))
}
