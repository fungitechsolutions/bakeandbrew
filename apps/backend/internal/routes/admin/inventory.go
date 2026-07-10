package admin

import (
	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inventory/products"
	adminInventoryStockIn "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inventory/stockin"
	adminInventoryStockOut "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inventory/stockout"
	adminInventorySummary "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inventory/summary"
	adminInventoryWastages "github.com/suprimkhatri77/sms/backend/internal/handlers/admin/inventory/wastages"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/routes/config"
)

func setupAdminInventoryRoutes(admin *gin.RouterGroup, cfg config.Config) {
	inv := admin.Group("/inventory")

	inv.GET("/products", products.ListProducts(cfg.Queries))
	inv.POST("/products", products.CreateProduct(cfg.Queries))
	inv.PUT("/products/:productID", products.EditProduct(cfg.Queries))
	inv.DELETE("/products/:productID", products.DeleteProduct(cfg.Queries))

	inv.GET("/stock/in", adminInventoryStockIn.ListStockIn(cfg.Queries))
	inv.POST("/stock/in", adminInventoryStockIn.CreateStockIn(repository.NewInventoryTxRepository(cfg.Queries, cfg.PgxPool), cfg.PgxPool))
	inv.PUT("/stock/in/:stockID", adminInventoryStockIn.UpdateStockIn(cfg.Queries))
	inv.DELETE("/stock/in/:stockID", adminInventoryStockIn.DeleteStockIn(cfg.Queries))

	inv.GET("/stock/out", adminInventoryStockOut.ListStockOut(cfg.Queries))
	inv.POST("/stock/out", adminInventoryStockOut.CreateStockOut(cfg.Queries))
	inv.PUT("/stock/out/:stockOutID", adminInventoryStockOut.UpdateStockOut(cfg.Queries))
	inv.DELETE("/stock/out/:stockOutID", adminInventoryStockOut.DeleteStockOut(cfg.Queries))

	inv.GET("/wastages", adminInventoryWastages.ListWastageStock(cfg.Queries))
	inv.POST("/wastages", adminInventoryWastages.CreateWastage(cfg.Queries))
	inv.PUT("/wastages/:wastageID", adminInventoryWastages.UpdateWastage(cfg.Queries))
	inv.DELETE("/wastages/:wastageID", adminInventoryWastages.DeleteWastage(cfg.Queries))

	inv.GET("/summary", adminInventorySummary.GetInventorySummary(cfg.Queries))
}
