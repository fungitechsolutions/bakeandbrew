package admin

import (
	"github.com/gin-gonic/gin"
	adminPayments "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/payments"
	adminStudents "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/students"
	adminStudentsDiscounts "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/students/discounts"
	adminStudentsScholarships "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/students/scholarships"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupAdminStudentRoutes(admin *gin.RouterGroup, cfg config.Config) {
	s := admin.Group("/students")

	s.GET("", adminStudents.ListStudents(cfg.Queries))
	s.GET("/outstanding", adminStudents.ListOutstandingStudentsDue(cfg.Queries))
	s.GET("/sales", adminStudents.ListSalesRevenueForStudents(cfg.Queries))
	s.GET("/:studentID/detail", adminStudents.StudentDetail(cfg.Queries))
	s.GET("/:studentID/courses", adminStudents.StudentEnrolledCourses(cfg.Queries))
	s.GET("/:studentID/payments", adminStudents.StudentPaymentDetails(cfg.Queries))
	s.PUT("/:studentID/status", adminStudents.UpdateStatus(cfg.Queries))
	s.POST("/:studentID/payments", adminPayments.AddPayment(repository.NewAdminPaymentTxRepository(cfg.Queries, cfg.PgxPool), cfg.PgxPool))
	s.PUT("/:studentID/info/guardian", adminStudents.UpdateGuardianInfo(cfg.Queries))
	s.PUT("/:studentID/info/personal", adminStudents.UpdateStudentPersonalInfo(cfg.Queries))

	s.POST("/:studentID/discounts", adminStudentsDiscounts.CreateDiscount(cfg.Queries))
	s.PUT("/:studentID/discounts/:discountID", adminStudentsDiscounts.UpdateDiscount(cfg.Queries))
	s.DELETE("/:studentID/discounts/:discountID", adminStudentsDiscounts.DeleteDiscount(cfg.Queries))
	s.GET("/:studentID/discounts", adminStudentsDiscounts.ListDiscount(cfg.Queries))

	s.POST("/:studentID/scholarships", adminStudentsScholarships.CreateScholarship(cfg.Queries))
	s.PUT("/:studentID/scholarships/:scholarshipID", adminStudentsScholarships.UpdateScholarship(cfg.Queries))
	s.DELETE("/:studentID/scholarships/:scholarshipID", adminStudentsScholarships.DeleteScholarship(cfg.Queries))
	s.GET("/:studentID/scholarships", adminStudentsScholarships.ListStudentScholarshipDetail(cfg.Queries))
}
