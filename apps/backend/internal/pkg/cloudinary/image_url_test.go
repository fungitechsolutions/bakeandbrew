package cloudinary

import "testing"

func TestIsOwnImageURL(t *testing.T) {
	const cloud = "bakecloud"

	tests := []struct {
		name      string
		rawURL    string
		cloudName string
		want      bool
	}{
		{"upload URL from our cloud", "https://res.cloudinary.com/bakecloud/image/upload/v1712345678/students/abc.jpg", cloud, true},
		{"transformed URL from our cloud", "https://res.cloudinary.com/bakecloud/image/upload/c_fill,w_200/abc.webp", cloud, true},
		{"query string is fine", "https://res.cloudinary.com/bakecloud/image/upload/abc.jpg?_a=x", cloud, true},

		{"empty URL", "", cloud, false},
		{"not a URL", "not a url", cloud, false},
		{"relative path", "/bakecloud/image/upload/abc.jpg", cloud, false},
		{"other host", "https://example.com/p.png", cloud, false},
		{"other allowed next/image host", "https://randomuser.me/api/portraits/men/1.jpg", cloud, false},
		{"lookalike host", "https://res.cloudinary.com.evil.com/bakecloud/abc.jpg", cloud, false},
		{"subdomain host", "https://evil.res.cloudinary.com/bakecloud/abc.jpg", cloud, false},
		{"http", "http://res.cloudinary.com/bakecloud/image/upload/abc.jpg", cloud, false},
		{"protocol-relative", "//res.cloudinary.com/bakecloud/image/upload/abc.jpg", cloud, false},
		{"explicit port", "https://res.cloudinary.com:443/bakecloud/image/upload/abc.jpg", cloud, false},
		{"userinfo", "https://user@res.cloudinary.com/bakecloud/image/upload/abc.jpg", cloud, false},
		{"userinfo pointing elsewhere", "https://res.cloudinary.com@evil.com/bakecloud/abc.jpg", cloud, false},
		{"another cloud", "https://res.cloudinary.com/demo/image/upload/sample.jpg", cloud, false},
		{"cloud name as prefix only", "https://res.cloudinary.com/bakecloud2/image/upload/abc.jpg", cloud, false},
		{"cloud name in another case", "https://res.cloudinary.com/BakeCloud/image/upload/abc.jpg", cloud, false},
		{"cloud root only", "https://res.cloudinary.com/bakecloud", cloud, false},
		{"cloud root with slash", "https://res.cloudinary.com/bakecloud/", cloud, false},
		{"dot-dot into another cloud", "https://res.cloudinary.com/bakecloud/../demo/image/upload/sample.jpg", cloud, false},
		{"encoded dot-dot into another cloud", "https://res.cloudinary.com/bakecloud/%2e%2e/demo/image/upload/sample.jpg", cloud, false},
		{"backslash dot-dot into another cloud", `https://res.cloudinary.com/bakecloud\..\demo/image/upload/sample.jpg`, cloud, false},
		{"double slash", "https://res.cloudinary.com//bakecloud/image/upload/abc.jpg", cloud, false},
		{"no cloud name configured", "https://res.cloudinary.com/bakecloud/image/upload/abc.jpg", "", false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := IsOwnImageURL(tt.rawURL, tt.cloudName)
			if got != tt.want {
				t.Errorf("IsOwnImageURL(%q, %q) = %v, want %v", tt.rawURL, tt.cloudName, got, tt.want)
			}
		})
	}
}
