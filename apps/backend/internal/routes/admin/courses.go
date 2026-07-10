package admin

import (
	"github.com/gin-gonic/gin"
	adminCourses "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/courses"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupAdminCourseRoutes(admin *gin.RouterGroup, cfg config.Config) {
	admin.GET("/courses", adminCourses.ListAllCourses(cfg.Queries))
	admin.POST("/courses", adminCourses.CreateCourse(cfg.Queries))
	admin.PUT("/courses/:courseID", adminCourses.UpdateCourse(cfg.Queries))
	admin.PATCH("/courses/:courseID", adminCourses.ToggleCourse(cfg.Queries))
	admin.DELETE("/courses/:courseID", adminCourses.DeleteCourse(cfg.Queries))
}
