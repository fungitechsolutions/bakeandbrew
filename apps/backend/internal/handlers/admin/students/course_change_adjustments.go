package students

import (
	"math/big"
	"sort"
	"time"
)

const (
	adjustmentKindDiscount    = "discount"
	adjustmentKindScholarship = "scholarship"
)

// feeAdjustment is a discount or the scholarship on a student, as a course
// change sees it.
type feeAdjustment struct {
	Kind  string
	Label string
	// Scales is true when the amount was worked out as a percent of the
	// balance (a percent discount or the scholarship), so it follows the fee.
	// A flat-amount discount keeps its amount.
	Scales    bool
	Amount    int64
	CreatedAt time.Time
}

// scaleToFee rescales amount from oldFee to newFee, rounding half up.
// big.Int because amount*newFee can overflow int64 for large fees in paisa.
func scaleToFee(amount, oldFee, newFee int64) int64 {
	if oldFee <= 0 || amount <= 0 {
		return amount
	}
	n := new(big.Int).Mul(big.NewInt(amount), big.NewInt(newFee))
	n.Add(n, big.NewInt(oldFee/2))
	n.Quo(n, big.NewInt(oldFee))
	return n.Int64()
}

// planCourseChangeAdjustments works out the discount and scholarship amounts
// after a student's total fee goes from oldFee to newFee with paid already
// paid. newAmounts is in the same order as adjustments.
//
// Percent-based amounts scale with the fee. Adjustments can only cover what
// payments don't, so if they no longer fit in newFee - paid, the newest are
// shrunk first (down to zero): a discount isn't cash and can't be refunded.
// excess is what was paid beyond newFee, owed back to the student.
func planCourseChangeAdjustments(oldFee, newFee, paid int64, adjustments []feeAdjustment) (newAmounts []int64, excess int64) {
	newAmounts = make([]int64, len(adjustments))
	var total int64
	for i, adj := range adjustments {
		amount := adj.Amount
		if adj.Scales {
			amount = scaleToFee(amount, oldFee, newFee)
		}
		newAmounts[i] = amount
		total += amount
	}

	room := newFee - paid
	if room < 0 {
		excess = -room
		room = 0
	}

	if total > room {
		newestFirst := make([]int, len(adjustments))
		for i := range newestFirst {
			newestFirst[i] = i
		}
		sort.SliceStable(newestFirst, func(a, b int) bool {
			return adjustments[newestFirst[a]].CreatedAt.After(adjustments[newestFirst[b]].CreatedAt)
		})

		over := total - room
		for _, i := range newestFirst {
			if over == 0 {
				break
			}
			cut := min(over, newAmounts[i])
			newAmounts[i] -= cut
			over -= cut
		}
	}

	return newAmounts, excess
}
