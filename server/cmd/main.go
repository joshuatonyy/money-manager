package main

import (
	"log"
	"money-manager/cmd/router"
	"money-manager/db"
	"money-manager/db/sqlc"
	"money-manager/internal/transaction"
	"money-manager/internal/user"
)

func main() {
	dbConn, err := db.NewDatabase()
	if err != nil {
		log.Fatalf("Initialize db connection failed %s", err)
	}

	queries := sqlc.New(dbConn.GetDB())

	userRep := user.NewRepository(queries)
	userSvc := user.NewService(userRep)
	userHandler := user.NewHandler(userSvc)

	transactionRep := transaction.NewRepository(queries)
	transactionSvc := transaction.NewService(transactionRep)
	transactionHandler := transaction.NewHandler(transactionSvc)


	router.InitRouter(userHandler, transactionHandler)
	router.Start("0.0.0.0:8080")
}
