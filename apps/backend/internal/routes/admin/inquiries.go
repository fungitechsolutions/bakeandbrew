package admin

import (
	"github.com/gin-gonic/gin"
	adminInquiries "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inquiries"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupAdminInquiryRoutes(admin *gin.RouterGroup, cfg config.Config) {
	admin.GET("/inquiries", adminInquiries.ListInquiries(cfg.Queries))
	admin.PATCH("/inquiries/:inquiryID", adminInquiries.MarkInquiryRead(cfg.Queries))
	admin.DELETE("/inquiries/:inquiryID", adminInquiries.DeleteInquiry(cfg.Queries))
}
