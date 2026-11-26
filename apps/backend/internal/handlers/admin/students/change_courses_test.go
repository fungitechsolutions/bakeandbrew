package students

import (
	"slices"
	"testing"

	"github.com/jackc/pgx/v5/pgtype"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
)

func courseID(b byte) pgtype.UUID {
	return pgtype.UUID{Bytes: [16]byte{b}, Valid: true}
}

func TestDiffCourseIDs(t *testing.T) {
	a, b, c := courseID(1), courseID(2), courseID(3)

	tests := []struct {
		name       string
		current    []pgtype.UUID
		requested  []pgtype.UUID
		wantAdd    []pgtype.UUID
		wantRemove []pgtype.UUID
	}{
		{name: "swap one course", current: []pgtype.UUID{a}, requested: []pgtype.UUID{b}, wantAdd: []pgtype.UUID{b}, wantRemove: []pgtype.UUID{a}},
		{name: "same set in another order", current: []pgtype.UUID{a, b}, requested: []pgtype.UUID{b, a}},
		{name: "add alongside kept course", current: []pgtype.UUID{a}, requested: []pgtype.UUID{a, b}, wantAdd: []pgtype.UUID{b}},
		{name: "drop one of two", current: []pgtype.UUID{a, b}, requested: []pgtype.UUID{b}, wantRemove: []pgtype.UUID{a}},
		{name: "duplicates only added once", current: []pgtype.UUID{a}, requested: []pgtype.UUID{c, c}, wantAdd: []pgtype.UUID{c}, wantRemove: []pgtype.UUID{a}},
		{name: "not enrolled in anything", requested: []pgtype.UUID{a}, wantAdd: []pgtype.UUID{a}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotAdd, gotRemove := diffCourseIDs(tt.current, tt.requested)
			if !slices.Equal(gotAdd, tt.wantAdd) {
				t.Errorf("toAdd = %v, want %v", gotAdd, tt.wantAdd)
			}
			if !slices.Equal(gotRemove, tt.wantRemove) {
				t.Errorf("toRemove = %v, want %v", gotRemove, tt.wantRemove)
			}
		})
	}
}

func TestCourseChangeBlockedMessage(t *testing.T) {
	// Payments, discounts and a scholarship are carried over, not blockers.
	carried := []db.GetStudentCourseChangeBlockersRow{
		{},
		{PaymentCount: 1},
		{DiscountCount: 1},
		{ScholarshipCount: 1},
	}
	for _, row := range carried {
		if got := courseChangeBlockedMessage(row); got != "" {
			t.Errorf("%+v: got %q, want no message", row, got)
		}
	}

	if got := courseChangeBlockedMessage(db.GetStudentCourseChangeBlockersRow{PaymentCount: 1, CertificateCount: 1}); got == "" {
		t.Error("certificate: expected a message")
	}
}

func TestCourseChangeNeedsConfirmation(t *testing.T) {
	tests := []struct {
		row  db.GetStudentCourseChangeBlockersRow
		want bool
	}{
		{row: db.GetStudentCourseChangeBlockersRow{}, want: false},
		{row: db.GetStudentCourseChangeBlockersRow{PaymentCount: 2}, want: true},
		{row: db.GetStudentCourseChangeBlockersRow{DiscountCount: 1}, want: true},
		{row: db.GetStudentCourseChangeBlockersRow{ScholarshipCount: 1}, want: true},
	}
	for _, tt := range tests {
		if got := courseChangeNeedsConfirmation(tt.row); got != tt.want {
			t.Errorf("%+v: got %v, want %v", tt.row, got, tt.want)
		}
	}
}

func TestCourseChangeExpectedMatches(t *testing.T) {
	summary := courseChangeSummary{TotalPaid: 100, NewTotalFee: 500, NewAdjustments: 50, ExcessAmount: 0, RequiresConfirmation: true}
	same := courseChangeExpected{TotalPaid: 100, NewTotalFee: 500, NewAdjustments: 50, ExcessAmount: 0, RequiresConfirmation: true}
	if !same.matches(summary) {
		t.Error("identical preview should match")
	}

	changed := []courseChangeExpected{
		{TotalPaid: 90, NewTotalFee: 500, NewAdjustments: 50, RequiresConfirmation: true},
		{TotalPaid: 100, NewTotalFee: 400, NewAdjustments: 50, RequiresConfirmation: true},
		{TotalPaid: 100, NewTotalFee: 500, NewAdjustments: 40, RequiresConfirmation: true},
		{TotalPaid: 100, NewTotalFee: 500, NewAdjustments: 50, ExcessAmount: 1, RequiresConfirmation: true},
		{TotalPaid: 100, NewTotalFee: 500, NewAdjustments: 50},
	}
	for _, e := range changed {
		if e.matches(summary) {
			t.Errorf("%+v should not match %+v", e, summary)
		}
	}
}
