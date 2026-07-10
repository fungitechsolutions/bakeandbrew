package middleware

import (
	"log/slog"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	"github.com/suprimkhatri77/sms/backend/internal/types"
)

// Recovery returns a middleware that recovers from panics and responds with 500.
func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				slog.Error("panic recovered",
					slog.String("method", c.Request.Method),
					slog.String("path", c.FullPath()),
					slog.String("ip", c.ClientIP()),
					slog.Any("panic", err),
					slog.String("stack", string(debug.Stack())),
				)
				c.JSON(http.StatusInternalServerError, types.APIResponse{
					Success: false,
					Message: "Failed to process request",
					Code:    constants.InternalServerError,
				})
				c.Abort()
			}
		}()
		c.Next()
	}
}
