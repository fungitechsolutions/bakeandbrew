package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/handlers/courses"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupCourseRoutes(router *gin.RouterGroup, cfg config.Config) {
	c := router.Group("/courses")
	c.GET("", courses.ListAllActiveCourses(cfg.Queries))
	c.GET("/:slug", courses.GetCourseDetail(cfg.Queries))
}
