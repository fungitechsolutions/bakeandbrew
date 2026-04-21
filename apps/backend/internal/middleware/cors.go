package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORS() gin.HandlerFunc {
	config := cors.DefaultConfig()

	config.AllowOrigins = []string{
		"http://localhost:3000",
	}

	config.AllowCredentials = true

	config.AllowMethods = []string{
		"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD",
	}

	config.AllowHeaders = []string{
		"Origin", "Content-Length", "Content-Type",
		"Authorization", "Accept",
	}

	config.ExposeHeaders = []string{"Content-Length"}

	return cors.New(config)
}
