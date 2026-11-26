package cloudinary

import (
	"net/url"
	"path"
	"strings"
)

const imageHost = "res.cloudinary.com"

// IsOwnImageURL reports whether rawURL points at an image on our own
// Cloudinary cloud: https://res.cloudinary.com/<cloudName>/<rest>.
// Photo URLs come from /uploads, which only ever returns such a URL; anything
// else would break next/image on the frontend (its remotePatterns allow
// res.cloudinary.com).
func IsOwnImageURL(rawURL, cloudName string) bool {
	if cloudName == "" {
		return false
	}

	// browsers read a backslash as a slash, so "a\..\b" would climb out of
	// our cloud's folder after this check
	if strings.Contains(rawURL, `\`) {
		return false
	}

	u, err := url.Parse(rawURL)
	if err != nil {
		return false
	}

	// u.Host keeps any port, so "res.cloudinary.com:8443" is rejected too
	if u.Scheme != "https" || u.Host != imageHost || u.User != nil {
		return false
	}

	// reject "." and ".." segments (also percent-encoded ones, which Parse
	// decodes): browsers resolve them, which could move the URL into another
	// cloud
	if path.Clean(u.Path) != u.Path {
		return false
	}

	cloud, rest, ok := strings.Cut(strings.TrimPrefix(u.Path, "/"), "/")
	return ok && cloud == cloudName && rest != ""
}
