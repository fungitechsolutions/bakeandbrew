package students

import (
	"slices"
	"testing"
	"time"
)

func TestScaleToFee(t *testing.T) {
	tests := []struct {
		name                   string
		amount, oldFee, newFee int64
		want                   int64
	}{
		{name: "cheaper course", amount: 500_000, oldFee: 5_000_000, newFee: 4_000_000, want: 400_000},
		{name: "dearer course", amount: 400_000, oldFee: 4_000_000, newFee: 5_000_000, want: 500_000},
		{name: "rounds half up", amount: 1, oldFee: 2, newFee: 1, want: 1},
		{name: "rounds down below half", amount: 1, oldFee: 3, newFee: 1, want: 0},
		{name: "no old fee keeps amount", amount: 100, oldFee: 0, newFee: 500, want: 100},
		{name: "large fees don't overflow", amount: 9_000_000_000, oldFee: 10_000_000_000, newFee: 5_000_000_000, want: 4_500_000_000},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := scaleToFee(tt.amount, tt.oldFee, tt.newFee); got != tt.want {
				t.Errorf("scaleToFee(%d, %d, %d) = %d, want %d", tt.amount, tt.oldFee, tt.newFee, got, tt.want)
			}
		})
	}
}

func TestPlanCourseChangeAdjustments(t *testing.T) {
	day := func(d int) time.Time { return time.Date(2026, 11, d, 0, 0, 0, 0, time.UTC) }
	percent := func(amount int64, d int) feeAdjustment {
		return feeAdjustment{Kind: adjustmentKindDiscount, Scales: true, Amount: amount, CreatedAt: day(d)}
	}
	flat := func(amount int64, d int) feeAdjustment {
		return feeAdjustment{Kind: adjustmentKindDiscount, Amount: amount, CreatedAt: day(d)}
	}

	tests := []struct {
		name                 string
		oldFee, newFee, paid int64
		adjustments          []feeAdjustment
		wantAmounts          []int64
		wantExcess           int64
	}{
		{
			name:   "payment only, cheaper course: carried forward",
			oldFee: 50_000, newFee: 40_000, paid: 20_000,
			wantAmounts: []int64{},
		},
		{
			name:   "paid more than the new fee",
			oldFee: 50_000, newFee: 40_000, paid: 45_000,
			wantAmounts: []int64{}, wantExcess: 5_000,
		},
		{
			name:   "paid exactly the new fee",
			oldFee: 50_000, newFee: 40_000, paid: 40_000,
			wantAmounts: []int64{},
		},
		{
			name:   "percent discount scales, flat keeps its amount",
			oldFee: 50_000, newFee: 40_000, paid: 10_000,
			adjustments: []feeAdjustment{percent(5_000, 1), flat(2_000, 2)},
			wantAmounts: []int64{4_000, 2_000},
		},
		{
			name:   "scholarship scales up on a dearer course",
			oldFee: 40_000, newFee: 60_000, paid: 0,
			adjustments: []feeAdjustment{{Kind: adjustmentKindScholarship, Scales: true, Amount: 20_000, CreatedAt: day(1)}},
			wantAmounts: []int64{30_000},
		},
		{
			name:   "adjustments don't fit: newest shrinks first",
			oldFee: 50_000, newFee: 30_000, paid: 25_000,
			// scaled: 3_000, flat 4_000 → 7_000 against 5_000 room
			adjustments: []feeAdjustment{percent(5_000, 1), flat(4_000, 2)},
			wantAmounts: []int64{3_000, 2_000},
		},
		{
			name:   "shrinking runs past the newest into older ones",
			oldFee: 50_000, newFee: 30_000, paid: 29_000,
			adjustments: []feeAdjustment{percent(5_000, 1), flat(4_000, 2)},
			wantAmounts: []int64{1_000, 0},
		},
		{
			name:   "overpaid: all adjustments drop to zero",
			oldFee: 50_000, newFee: 20_000, paid: 30_000,
			adjustments: []feeAdjustment{percent(5_000, 1), flat(4_000, 2)},
			wantAmounts: []int64{0, 0}, wantExcess: 10_000,
		},
		{
			name:   "newest is picked by date, not position",
			oldFee: 10_000, newFee: 10_000, paid: 9_000,
			adjustments: []feeAdjustment{flat(1_000, 5), flat(1_000, 1)},
			wantAmounts: []int64{0, 1_000},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotAmounts, gotExcess := planCourseChangeAdjustments(tt.oldFee, tt.newFee, tt.paid, tt.adjustments)
			if !slices.Equal(gotAmounts, tt.wantAmounts) {
				t.Errorf("amounts = %v, want %v", gotAmounts, tt.wantAmounts)
			}
			if gotExcess != tt.wantExcess {
				t.Errorf("excess = %d, want %d", gotExcess, tt.wantExcess)
			}
		})
	}
}
