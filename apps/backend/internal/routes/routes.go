package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/suprimkhatri77/sms/backend/internal/config"
	accountingRepository "github.com/suprimkhatri77/sms/backend/internal/repository/accounting"
	"github.com/suprimkhatri77/sms/backend/internal/types"

	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"

	bankaccounts "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/accounting/bank_accounts"
	bankledger "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/accounting/bank_ledger"
	"github.com/suprimkhatri77/sms/backend/internal/handlers/admin/accounting/banks"
	adminAnalytics "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/analytics"
	adminCourses "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/courses"
	adminInquiries "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inquiries"
	"github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inventory/products"
	studentPortal "github.com/suprimkhatri77/sms/backend/internal/handlers/student_portal"

	adminPayments "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/payments"

	adminSettings "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/settings"
	adminStudents "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/students"
	adminStudentsDiscount "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/students/discount"
	adminStudentsScholarship "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/students/scholarship"
	adminUsers "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/users"

	adminInventoryStockIn "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inventory/stock/in"
	adminInventoryStockOut "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inventory/stock/stock-out"
	adminInventoryWastage "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inventory/stock/wastage"
	adminInventorySummary "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inventory/summary"

	"github.com/suprimkhatri77/sms/backend/internal/handlers/auth"
	"github.com/suprimkhatri77/sms/backend/internal/handlers/courses"
	"github.com/suprimkhatri77/sms/backend/internal/handlers/student"

	upload "github.com/suprimkhatri77/sms/backend/internal/handlers/uploads"

	"github.com/suprimkhatri77/sms/backend/internal/middleware"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/cloudinary"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
)

type Config struct {
	Config      *config.Config
	Queries     *db.Queries
	CldClient   *cloudinary.Client
	StudentRepo repository.StudentRepository
	PgxPool     *pgxpool.Pool
}

func Setup(r *gin.Engine, cfg Config) {
	router := r.Group("/api/v1")

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Server is up and running",
		})

	})

	router.POST("/uploads", middleware.RequireAuth(cfg.Config), middleware.RequireRole("student", "admin", "superadmin"), upload.Upload(cfg.CldClient))

	authRouter := router.Group("/auth")

	// auth routes
	authRouter.POST("/login", auth.Login(cfg.Queries, cfg.Config))
	authRouter.POST("/signup", auth.Signup(cfg.Queries, cfg.Config))
	authRouter.POST("/logout", auth.Logout(cfg.Queries, cfg.Config))
	authRouter.POST("/refresh", auth.RotateTokens(cfg.Queries, cfg.Config))
	authRouter.POST("/bootstrap", auth.Bootstrap(cfg.Queries, cfg.Config))
	authRouter.GET("/me", middleware.RequireAuth(cfg.Config), middleware.RequireRole("admin", "superadmin", "student"), auth.Me(cfg.Queries))

	adminRouter := router.Group("/admin", middleware.RequireAuth(cfg.Config), middleware.RequireRole("admin", "superadmin"))

	// admin/users
	adminRouter.POST("/users", adminUsers.CreateUser(cfg.Queries))
	adminRouter.GET("/users", adminUsers.GetPaginatedUsers(cfg.Queries))
	adminRouter.PUT("/users/:userID", adminUsers.UpdateUser(cfg.Queries))

	adminStudentRouter := adminRouter.Group("/students")

	// admin/students
	adminStudentRouter.GET("", adminStudents.ListStudents(cfg.Queries))

	// admin/students/outstanding
	adminStudentRouter.GET("/outstanding", adminStudents.ListOutstandingStudentsDue(cfg.Queries))

	// admin/students/sales
	adminStudentRouter.GET("/sales", adminStudents.ListSalesRevenueForStudents(cfg.Queries))

	// admin/students/:id
	adminStudentRouter.GET("/:studentID/detail", adminStudents.StudentDetail(cfg.Queries))
	adminStudentRouter.GET("/:studentID/courses", adminStudents.StudentEnrolledCourses(cfg.Queries))
	adminStudentRouter.GET("/:studentID/payments", adminStudents.StudentPaymentDetails(cfg.Queries))
	adminStudentRouter.PUT("/:studentID/status", adminStudents.UpdateStatus(cfg.Queries))
	adminStudentRouter.POST("/:studentID/payments", adminPayments.AddPayment(cfg.Queries))
	adminStudentRouter.PUT("/:studentID/info/guardian", adminStudents.UpdateGuardianInfo(cfg.Queries))
	adminStudentRouter.PUT("/:studentID/info/personal", adminStudents.UpdateStudentPersonalInfo(cfg.Queries))

	// admin/students/discount
	adminStudentRouter.POST("/:studentID/discounts", adminStudentsDiscount.CreateDiscount(cfg.Queries))
	adminStudentRouter.PUT("/:studentID/discounts/:discountID", adminStudentsDiscount.UpdateDiscount(cfg.Queries))
	adminStudentRouter.DELETE("/:studentID/discounts/:discountID", adminStudentsDiscount.DeleteDiscount(cfg.Queries))
	adminStudentRouter.GET("/:studentID/discounts", adminStudentsDiscount.ListDiscount(cfg.Queries))

	// admin/students/scholarship
	adminStudentRouter.POST("/:studentID/scholarships", adminStudentsScholarship.CreateScholarship(cfg.Queries))
	adminStudentRouter.PUT("/:studentID/scholarships/:scholarshipID", adminStudentsScholarship.UpdateScholarship(cfg.Queries))
	adminStudentRouter.DELETE("/:studentID/scholarships/:scholarshipID", adminStudentsScholarship.DeleteScholarship(cfg.Queries))
	adminStudentRouter.GET("/:studentID/scholarships", adminStudentsScholarship.ListStudentScholarshipDetail(cfg.Queries))

	// admin/courses
	adminRouter.GET("/courses", adminCourses.ListAllCourses(cfg.Queries))
	adminRouter.PATCH("/courses/:courseID", adminCourses.ToggleCourse(cfg.Queries))
	adminRouter.POST("/courses", adminCourses.CreateCourse(cfg.Queries))
	adminRouter.DELETE("/courses/:courseID", adminCourses.DeleteCourse(cfg.Queries))
	adminRouter.PUT("/courses/:courseID", adminCourses.UpdateCourse(cfg.Queries))

	// admin/settings
	adminRouter.GET("/settings", adminSettings.GetSettings(cfg.Queries))
	adminRouter.PUT("/settings/:key", adminSettings.UpdateSetting(cfg.Queries))

	// admin/inquiries
	adminRouter.GET("/inquiries", adminInquiries.ListInquiries(cfg.Queries))
	adminRouter.PATCH("/inquiries/:inquiryID", adminInquiries.MarkInquiryRead(cfg.Queries))
	adminRouter.DELETE("/inquiries/:inquiryID", adminInquiries.DeleteInquiry(cfg.Queries))

	// admin/analytics
	adminRouter.GET("/analytics", adminAnalytics.GetAnalytics(cfg.Queries))

	// admin/inventory
	adminInventoryRouter := adminRouter.Group("/inventory")
	adminInventoryRouter.GET("/products", products.ListProducts(cfg.Queries))
	adminInventoryRouter.POST("/products", products.CreateProduct(cfg.Queries))
	adminInventoryRouter.PUT("/products/:productID", products.EditProduct(cfg.Queries))
	adminInventoryRouter.DELETE("/products/:productID", products.DeleteProduct(cfg.Queries))

	// admin/inventory/stock/in
	adminInventoryRouter.GET("/stock/in", adminInventoryStockIn.ListStockIn(cfg.Queries))
	adminInventoryRouter.POST("/stock/in", adminInventoryStockIn.CreateStockIn(cfg.Queries))
	adminInventoryRouter.PUT("/stock/in/:stockID", adminInventoryStockIn.UpdateStockIn(cfg.Queries))
	adminInventoryRouter.DELETE("/stock/in/:stockID", adminInventoryStockIn.DeleteStockIn(cfg.Queries))

	// admin/inventory/stock/out
	adminInventoryRouter.GET("/stock/out", adminInventoryStockOut.ListStockOut(cfg.Queries))
	adminInventoryRouter.POST("/stock/out", adminInventoryStockOut.CreateStockOut(cfg.Queries))
	adminInventoryRouter.PUT("/stock/out/:stockOutID", adminInventoryStockOut.UpdateStockOut(cfg.Queries))
	adminInventoryRouter.DELETE("/stock/out/:stockOutID", adminInventoryStockOut.DeleteStockOut(cfg.Queries))

	// admin/inventory/wastages
	adminInventoryRouter.GET("/wastages", adminInventoryWastage.ListWastageStock(cfg.Queries))
	adminInventoryRouter.POST("/wastages", adminInventoryWastage.CreateWastage(cfg.Queries))
	adminInventoryRouter.PUT("/wastages/:wastageID", adminInventoryWastage.UpdateWastage(cfg.Queries))
	adminInventoryRouter.DELETE("/wastages/:wastageID", adminInventoryWastage.DeleteWastage(cfg.Queries))

	// admin/inventory/summary
	adminInventoryRouter.GET("/summary", adminInventorySummary.GetInventorySummary(cfg.Queries))

	adminAccountingRouter := adminRouter.Group("/accounting")
	adminBankRouter := adminAccountingRouter.Group("/banks")
	adminBankRouter.POST("", banks.CreateBank(cfg.Queries))
	adminBankRouter.PUT("/:bankID", banks.UpdateBank(cfg.Queries))
	adminBankRouter.DELETE("/:bankID", banks.DeleteBank(cfg.Queries))
	adminBankRouter.GET("", banks.ListBanks(cfg.Queries))
	adminBankRouter.PUT("/set-default/:bankID", banks.SetDefaultBank(accountingRepository.NewBankTxRepository(cfg.Queries), cfg.PgxPool))

	adminBankRouter.GET("/ledger", bankledger.ListBankLedger(cfg.Queries))
	adminBankRouter.POST("/ledger/:accountID", bankledger.CreateBankLedgerEntry(cfg.Queries))
	adminBankRouter.GET("/ledger/summary", bankledger.GetBankLedgerSummary(cfg.Queries))

	adminBankAccountRouter := adminBankRouter.Group("")
	adminBankAccountRouter.GET("/accounts", bankaccounts.ListBankAccounts(cfg.Queries))
	adminBankAccountRouter.GET("/accounts/dropdown", bankaccounts.ListBankAccountsForDropdown(cfg.Queries))
	adminBankAccountRouter.POST("/:bankID/accounts", bankaccounts.CreateBankAccount(cfg.Queries))
	adminBankAccountRouter.PUT("/accounts/:accountID", bankaccounts.UpdateBankAccount(cfg.Queries))
	adminBankAccountRouter.DELETE("/accounts/:accountID", bankaccounts.DeleteBankAccount(cfg.Queries))
	adminBankAccountRouter.PUT("/accounts/:accountID/set-default", bankaccounts.SetDefaultBankAccount(accountingRepository.NewBankAccountTxRepository(cfg.Queries), cfg.PgxPool))

	// public student routes
	studentRouter := router.Group("/students")
	studentRouter.POST("/admission", middleware.RequireAuth(cfg.Config), middleware.RequireRole("student"), student.CreateStudent(cfg.StudentRepo, cfg.PgxPool))
	studentRouter.GET("/admission/status", middleware.RequireAuth(cfg.Config), middleware.RequireRole("student"), student.GetStudentAdmissionStatus(cfg.StudentRepo))
	studentRouter.POST("/inquiry", student.CreateInquiry(cfg.StudentRepo))

	// public courses routes
	coursesRouter := router.Group("/courses")
	coursesRouter.GET("", courses.ListAllActiveCourses(cfg.Queries))
	coursesRouter.GET("/:slug", courses.GetCourseDetail(cfg.Queries))

	studentPortalRouter := router.Group(
		"/portal/student",
		middleware.RequireAuth(cfg.Config),
		middleware.RequireRole("student"),
	)

	studentPortalRouter.GET("/overview", studentPortal.GetStudentOverview(cfg.Queries))
	studentPortalRouter.GET("/courses", studentPortal.GetStudentCourses(cfg.Queries))
	studentPortalRouter.GET("/payments", studentPortal.GetStudentPayments(cfg.Queries))
	studentPortalRouter.GET("/fee/summary", studentPortal.GetStudentFeeSummary(cfg.Queries))
	studentPortalRouter.GET("/status", studentPortal.GetStudentStatusByUserID(cfg.Queries))
	studentPortalRouter.GET("/pending-overview", studentPortal.GetStudentPendingOverview(cfg.Queries))
	studentPortalRouter.GET("/rejected-overview", studentPortal.GetStudentRejectedOverview(cfg.Queries))
	studentPortalRouter.GET("/discounts", studentPortal.GetStudentDiscounts(cfg.Queries))
	studentPortalRouter.GET("/scholarship", studentPortal.GetStudentScholarship(cfg.Queries))
}
