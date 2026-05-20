export {
  loginInputSchema,
  loginResponse,
  signupInputSchema,
  type LoginInput,
  type LoginResponse,
  type User,
  type UsersList,
  type SignupResponse,
  type SignupInput,
  type JWTUser,
} from "./auth";

export { type BaseAPIResponse, type APIResponse, type APIError } from "./base";

export {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "./user";

export {
  createStudentAdmissionRequest,
  inquiryFormSchema,
  type CreateStudentAdmission,
  type InquiryForm,
} from "./student";

export { type ImageUploadResponse } from "./upload";

export {
  createProductResponseSchema,
  createStockInSchema,
  createStockOutSchema,
  editStockOutSchema,
  createWastageSchema,
  editWastageSchema,
  type CreateProductInput,
  type CreateProductResponse,
  type GetProductResponse,
  type UpdateProductResponse,
  type DeleteProductResponse,
  type CreateStockInResponse,
  type CreateStockInInput,
  type ListStockInResponse,
  type DeleteStockInResponse,
  type CreateStockOutInput,
  type ListStockOutResponse,
  type CreateStockOutResponse,
  type DeleteStockOutResponse,
  type EditStockOutResponse,
  type EditStockOutInput,
  type DeleteWastageResponse,
  type EditWastageResponse,
  type EditWastageInput,
  type CreateWastageInput,
  type CreateWastageResponse,
  type ListWastageResponse,
  type InventorySummaryResponse,
} from "./inventory";

export { type CoursesList, type CourseDetailResponse } from "./courses";

export {
  studentDiscountMutationSchema,
  type CreateStudentDiscountRequest,
  type UpdateStudentDiscountRequest,
  type DeleteStudentDiscountResponse,
  type UpdateStudentDiscountResponse,
  type CreateStudentDiscountResponse,
  type StudentDiscountMutationInput,
} from "./admin/students/discount";
export {
  studentScholarshipMutationSchema,
  type GetStudentScholarshipResponse,
  type StudentScholarshipMutationResponse,
  type StudentScholarshipInput,
} from "./admin/students/scholarship";

export { type StudentAdmissionResponse } from "./admission";
export {
  addPaymentSchema,
  createCourseSchema,
  updateCourseSchema,
  updateSetting,
  updateStudentStatusSchema,
  type ListStudent,
  type StudentDetail,
  type StudentEnrolledCourses,
  type StudentPaymentDetails,
  type UpdateStudentStatus,
  type UpdateStudentStatusResponse,
  type AddPayment,
  type AddPaymentResponse,
  type CoursesListResponse,
  type CreateCourse,
  type UpdateCourse,
  type ToggleCourse,
  type CreateCourseResponse,
  type UpdateCourseResponse,
  type DeleteCourse,
  type SettingsListResponse,
  type UpdateSettingResponse,
  type InquiriesList,
  type MarkInquiryReadResponse,
  type DeleteInquiryResponse,
  type AnalyticsResponse,
  type StudentScholarshipResponse,
  type StudentDiscountResponse,
} from "./admin";

export { type GetStudentOverviewResponse } from "./student_portal/overview";
export {
  type GetStudentFeeSummaryResponse,
  type GetStudentPaymentsResponse,
} from "./student_portal/payments";
export { type GetStudentCoursesResponse } from "./student_portal/enrollments";
