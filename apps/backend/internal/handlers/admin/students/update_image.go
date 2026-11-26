package students

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/suprimkhatri77/sms/backend/internal/constants"
	db "github.com/suprimkhatri77/sms/backend/internal/database/generated"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/applog"
	"github.com/suprimkhatri77/sms/backend/internal/pkg/cloudinary"
	"github.com/suprimkhatri77/sms/backend/internal/repository"
	"github.com/suprimkhatri77/sms/backend/internal/types"
	"github.com/suprimkhatri77/sms/backend/internal/utils"
)

const handlerUpdateStudentImage = "UpdateStudentImage"

type UpdateStudentImageRequest struct {
	ImageUrl string `json:"imageUrl" binding:"omitempty,url"`
}

func UpdateStudentImage(queries repository.AdminRepository, cloudinaryCloudName string) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()

		studentIDFromParams := c.Param("studentID")

		studentID, err := utils.ConvertToUUID(studentIDFromParams)
		if err != nil {
			applog.Warn(c, handlerUpdateStudentImage, "invalid student id format",
				slog.String("student_id_raw", studentIDFromParams),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid ID format",
				Code:    constants.InvalidIDFormat,
			})
			return
		}

		var req UpdateStudentImageRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			applog.Warn(c, handlerUpdateStudentImage, "invalid image url",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Invalid image URL",
				Code:    constants.ValidationFailed,
			})
			return
		}

		utils.TrimStruct(&req)

		// an empty URL clears the photo
		if req.ImageUrl != "" && !cloudinary.IsOwnImageURL(req.ImageUrl, cloudinaryCloudName) {
			applog.Warn(c, handlerUpdateStudentImage, "image url is not a cloudinary upload",
				applog.WithStudentID(studentIDFromParams),
			)
			c.JSON(http.StatusBadRequest, types.APIResponse{
				Success: false,
				Message: "Image must be uploaded through the app",
				Code:    constants.ValidationFailed,
				Errors: []types.AppError{{
					Code:    constants.InvalidImageURL,
					Field:   "imageUrl",
					Message: "Image must be uploaded through the app",
				}},
			})
			return
		}

		_, err = queries.UpdateStudentImage(ctx, db.UpdateStudentImageParams{
			ID:       studentID,
			PhotoUrl: utils.ToNullableText(req.ImageUrl),
		})
		if err != nil {
			applog.Error(c, handlerUpdateStudentImage, "failed to update student image",
				applog.WithStudentID(studentIDFromParams),
				slog.Any(applog.AttrError, err),
			)
			c.JSON(http.StatusInternalServerError, types.APIResponse{
				Success: false,
				Message: "Failed to update student image",
				Code:    constants.InternalServerError,
			})
			return
		}

		applog.Info(c, handlerUpdateStudentImage, "student image updated successfully",
			applog.WithStudentID(studentIDFromParams),
			slog.Bool("image_cleared", req.ImageUrl == ""),
		)

		c.JSON(http.StatusOK, types.APIResponse{
			Success: true,
			Message: "Student image updated successfully",
		})
	}

}
