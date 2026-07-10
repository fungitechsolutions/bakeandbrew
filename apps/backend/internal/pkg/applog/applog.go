package applog

import (
	"log/slog"

	"github.com/gin-gonic/gin"
)

const (
	AttrHandler         = "handler"
	AttrMethod          = "method"
	AttrPath            = "path"
	AttrIP              = "ip"
	AttrUserID          = "user_id"
	AttrStudentID       = "student_id"
	AttrError           = "error"
	AttrStudentStatus   = "student_status"
	AttrCertificateType = "certificate_type"
)

// Base returns common request-scoped attributes for structured logs.
func Base(c *gin.Context, handler string) []any {
	attrs := []any{
		slog.String(AttrHandler, handler),
		slog.String(AttrMethod, c.Request.Method),
		slog.String(AttrPath, c.FullPath()),
		slog.String(AttrIP, c.ClientIP()),
	}

	if userID, ok := c.Get("userID"); ok {
		if id, ok := userID.(string); ok && id != "" {
			attrs = append(attrs, slog.String(AttrUserID, id))
		}
	}

	return attrs
}

func WithStudentID(studentID string) slog.Attr {
	return slog.String(AttrStudentID, studentID)
}

func Debug(c *gin.Context, handler, msg string, attrs ...any) {
	slog.Debug(msg, append(Base(c, handler), attrs...)...)
}

func Info(c *gin.Context, handler, msg string, attrs ...any) {
	slog.Info(msg, append(Base(c, handler), attrs...)...)
}

func Warn(c *gin.Context, handler, msg string, attrs ...any) {
	slog.Warn(msg, append(Base(c, handler), attrs...)...)
}

func Error(c *gin.Context, handler, msg string, attrs ...any) {
	slog.Error(msg, append(Base(c, handler), attrs...)...)
}
