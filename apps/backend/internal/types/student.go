package types

import "github.com/jackc/pgx/v5/pgtype"

type CreateStudentRequest struct {
	FullName      string   `json:"fullName" binding:"required,notblank,min=2,max=70,alphaspace"`
	DobAD         string   `json:"dobAD" binding:"required,notblank,date_format"`
	DobBS         string   `json:"dobBS" binding:"required,notblank,date_format"`
	Phone         string   `json:"phone" binding:"required,notblank,nepal_phone"`
	Address       string   `json:"address" binding:"required,notblank,max=70"`
	PhotoUrl      string   `json:"photoUrl" binding:"omitempty,url"`
	Source        string   `json:"source" binding:"required,oneof=facebook instagram tiktok referral inperson"`
	GuardianName  string   `json:"guardianName" binding:"required,notblank,min=2,max=70"`
	GuardianPhone string   `json:"guardianPhone" binding:"required,notblank,nepal_phone"`
	Gender        string   `json:"gender" binding:"required,oneof=male female other"`
	Shift         string   `json:"shift" binding:"required,oneof=morning day evening"`
	ShiftTime     string   `json:"shiftTime" binding:"required,notblank,min=1,max=100"`
	Courses       []string `json:"courses" binding:"required,min=1,dive,uuid"`
}

type CreateStudentInquiryRequest struct {
	FullName string `json:"fullName" binding:"required,notblank,alphaspace"`
	Phone    string `json:"phone" binding:"required,notblank,nepal_phone"`
	Message  string `json:"message" binding:"required,notblank,min=5,max=200"`
	Email    string `json:"email" binding:"required,email"`
	Source   string `json:"source" binding:"required,oneof= facebook instagram tiktok referral inPerson"`
}

type Student struct {
	ID            pgtype.UUID `json:"id"`
	FullName      string      `json:"fullName"`
	DOB           pgtype.Date `json:"dob"`
	Phone         string      `json:"phone"`
	Email         pgtype.Text `json:"email"`
	Address       string      `json:"address"`
	PhotoUrl      pgtype.Text `json:"photoUrl"`
	Source        string      `json:"source"`
	GuardianName  string      `json:"guardianName"`
	GuardianPhone string      `json:"guardianPhone"`
	Gender        string      `json:"gender"`
	FiscalYear    string      `json:"fiscalYear"`
	ReferenceNo   string      `json:"referenceNo"`
	SerialNo      int         `json:"serialNo"`
	Notes         pgtype.Text `json:"notes"`
	Status        string      `json:"status"`
}
type ListStudent struct {
	ID          pgtype.UUID `json:"id"`
	FullName    string      `json:"fullName"`
	Phone       string      `json:"phone"`
	ReferenceNo string      `json:"referenceNo"`
	Status      string      `json:"status"`
	Courses     []string    `json:"courses"`
	Batch       string      `json:"batch"`
	Shift       string      `json:"shift"`
}

type UpdateStudentStatusRequest struct {
	Status          string `json:"status" binding:"required,oneof=pending active completed rejected"`
	RejectionReason string `json:"rejectionReason" binding:"required_if=Status rejected,omitempty,min=1,max=500"`
}
