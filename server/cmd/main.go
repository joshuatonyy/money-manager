package main

import (
	"log"
	"money-manager/cmd/router"
	"money-manager/db"
	"money-manager/db/sqlc"
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

	// postRep := post.NewRepository(queries)
	// postSvc := post.NewService(postRep)
	// postHandler := post.NewHandler(postSvc)


	router.InitRouter(userHandler)
	router.Start("0.0.0.0:8080")
}
