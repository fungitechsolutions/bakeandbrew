package discount

import (
	"testing"

	"github.com/jackc/pgx/v5/pgtype"
)

// numeric builds a percent the way it comes back from the NUMERIC(5,2) column.
func numeric(t *testing.T, s string) pgtype.Numeric {
	t.Helper()
	var n pgtype.Numeric
	if err := n.Scan(s); err != nil {
		t.Fatalf("scan %q: %v", s, err)
	}
	return n
}

func TestDiscountPercentLabel(t *testing.T) {
	tests := []struct {
		name    string
		mode    string
		percent string
		want    string
	}{
		{"percent mode", "percent", "10.00", "10%"},
		{"percent mode with decimals", "percent", "2.50", "2.5%"},
		{"flat amount shows the percent it came to", "amount", "10.04", "10.04% (flat)"},
		{"flat amount of the whole balance", "amount", "100.00", "100% (flat)"},
		{"flat amount that rounded to 0.00", "amount", "0.00", "<0.01% (flat)"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := discountPercentLabel(tt.mode, numeric(t, tt.percent))
			if err != nil {
				t.Fatalf("discountPercentLabel(%q, %s) error: %v", tt.mode, tt.percent, err)
			}
			if got != tt.want {
				t.Errorf("discountPercentLabel(%q, %s) = %q, want %q", tt.mode, tt.percent, got, tt.want)
			}
		})
	}
}
