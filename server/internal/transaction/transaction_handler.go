package transaction

import (
	"money-manager/db/sqlc"
	"net/http"
	"strconv"
	"time"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service
}

func NewHandler(s Service) *Handler {
	return &Handler{s}
}

func (h *Handler) CreateTransaction(c *gin.Context) {
	var req CreateTransactionFrontend

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, err := strconv.ParseInt(req.UserID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user_id format"})
		return
	}

	date, err := time.Parse("2006-01-02", req.TransactionDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	newReq := sqlc.CreateTransactionParams{
		UserID:              int32(userID),
		TransactionDate:     date,
		TransactionCategory: req.TransactionCategory,
		TransactionAccount:  req.TransactionAccount,
		TransactionAmount:   req.TransactionAmount,
		TransactionNotes:    req.TransactionNotes,
		TransactionImageUrl: req.TransactionImageUrl,
		TransactionVerified: req.TransactionVerified,
	}

	res, err := h.Service.CreateTransaction(c.Request.Context(), &newReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *Handler) EditTransaction(c *gin.Context) {
	var req EditTransactionFrontend

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	transactionID, err := strconv.ParseInt(c.Param("transactionID"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Transaction ID"})
		return
	}

	date, err := time.Parse("2006-01-02", req.TransactionDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	newReq := sqlc.EditTransactionParams{
		TransactionID:       transactionID,
		TransactionCategory: req.TransactionCategory,
		TransactionAccount:  req.TransactionAccount,
		TransactionDate:     date,
		TransactionAmount:   req.TransactionAmount,
		TransactionNotes:    req.TransactionNotes,
		TransactionImageUrl: req.TransactionImageUrl,
		TransactionVerified: req.TransactionVerified,
	}

	res, err := h.Service.EditTransaction(c.Request.Context(), &newReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

func (h *Handler) GetTransactionsByUserID(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in token"})
		return
	}

	var userIDInt int64
	switch v := userID.(type) {
	case string:
		id, err := strconv.ParseInt(v, 10, 64)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
			return
		}
		userIDInt = id
	case float64:
		userIDInt = int64(v)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unexpected user ID type"})
		return
	}

	transactions, err := h.Service.GetTransactionsByUserID(c.Request.Context(), userIDInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": transactions})
}

func (h *Handler) GetTransactionsBetweenDate(c *gin.Context) {
	var req GetTransactionsBetweenDateFrontend

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in token"})
		return
	}

	var userIDInt int64
	switch v := userID.(type) {
	case string:
		id, err := strconv.ParseInt(v, 10, 64)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
			return
		}
		userIDInt = id
	case float64:
		userIDInt = int64(v)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unexpected user ID type"})
		return
	}

	date1, err := time.Parse("2006-01-02", req.TransactionDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	date2, err := time.Parse("2006-01-02", req.TransactionDate_2)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	newReq := sqlc.GetTransactionsBetweenDateParams{
		UserID: int32(userIDInt),
		TransactionDate: date1,
		TransactionDate_2: date2,
	}

	transactions, err := h.Service.GetTransactionsBetweenDateParams(c.Request.Context(), &newReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": transactions})
}

func (h *Handler) UploadImage(c *gin.Context) {
    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "File upload failed"})
        return
    }

    filename := time.Now().Format("20060102150405") + "_" + filepath.Base(file.Filename)
    savePath := filepath.Join("uploads", filename)

    if err := c.SaveUploadedFile(file, savePath); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
        return
    }

    baseURL := c.Request.Host
    fileURL := "http://" + baseURL + "/uploads/" + filename
    c.JSON(http.StatusOK, gin.H{"filePath": fileURL})
}