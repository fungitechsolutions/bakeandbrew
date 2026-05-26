package constants

const (
	// general
	InternalServerError = "INTERNAL_SERVER_ERROR"
	ValidationFailed    = "VALIDATION_FAILED"
	Unauthorized        = "UNAUTHORIZED"
	InvalidPageParam    = "INVALID_PAGE_PARAMETER"
	InvalidIDFormat     = "INVALID_ID_FORMAT"
	InvalidQueryParam   = "INVALID_QUERY_PARAM"

	// auth
	InvalidCredentials  = "INVALID_CREDENTIALS"
	MissingRefreshToken = "MISSING_REFRESH_TOKEN"
	InvalidRefreshToken = "INVALID_REFRESH_TOKEN"
	UserAlreadyExists   = "USER_ALREADY_EXISTS"
	RefreshTokenExpired = "REFRESH_TOKEN_EXPIRED"
	InvalidToken        = "INVALID_TOKEN"
	Forbidden           = "FORBIDDEN"
	MissingAccessToken  = "MISSING_ACCESS_TOKEN"
	InvalidAccessToken  = "INVALID_ACCESS_TOKEN"
	UserNotFound        = "USER_NOT_FOUND"

	// setting
	MissingSettingKey = "MISSING_SETTING_KEY"
	SettingNotFound   = "SETTING_NOT_FOUND"

	// student
	StudentAlreadyExists = "STUDENT_ALREADY_EXISTS"
	MissingStudentID     = "MISSING_STUDENT_ID"
	StudentNotFound      = "STUDENT_NOT_FOUND"
	InvalidStudentStatus = "INVALID_STUDENT_STATUS"
	StudentNotRegistered = "STUDENT_NOT_REGISTERED"

	// course
	CourseNotFound      = "COURSE_NOT_FOUND"
	MissingCourseID     = "MISSING_COURSE_ID"
	CourseAlreadyExists = "COURSE_ALREADY_EXISTS"

	// inquiries
	InquiryNotFound  = "INQUIRY_NOT_FOUND"
	MissingInquiryID = "MISSING_INQUIRY_ID"

	// image upload
	ImageIsRequired    = "IMAGE_IS_REQUIRED"
	InvalidImageFormat = "INVALID_IMAGE_FORMAT"
	InvalidImageSize   = "INVALID_IMAGE_SIZE"

	// inventory
	ProductAlreadyExists = "PRODUCT_ALREADY_EXISTS"
	ProductNotFound      = "PRODUCT_NOT_FOUND"
	MissingProductID     = "MISSING_PRODUCT_ID"

	MissingStockID = "MISSING_STOCK_ID"

	MissingWastageID = "MISSING_WASTAGE_ID"

	// student discounts
	MissingStudentDiscountID = "MISSING_STUDENT_DISCOUNT_ID"
	DiscountNotFound         = "DISCOUNT_NOT_FOUND"

	// student scholarships
	MissingStudentScholarshipID = "MISSING_STUDENT_SCHOLARSHIP_ID"
	ScholarshipNotFound         = "SCHOLARSHIP_NOT_FOUND"

	// banks
	BankAlreadyExists        = "BANK_ALREADY_EXISTS"
	DefaultBankAlreadyExists = "DEFAULT_BANK_ALREADY_EXISTS"
	MissingBankID            = "MISSING_BANK_ID"
	BankNotFound             = "BANK_NOT_FOUND"

	// bank accounts
	BankAccountAlreadyExists        = "BANK_ACCOUNT_ALREADY_EXISTS"
	DefaultBankAccountAlreadyExists = "DEFAULT_BANK_ACCOUNT_ALREADY_EXISTS"
	BankAccountNotFound             = "BANK_ACCOUNT_NOT_FOUND"
	BankAccountHasLedgerEntries     = "BANK_ACCOUNT_HAS_LEDGER_ENTRIES"
)
