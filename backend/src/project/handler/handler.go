package handler

import (
	"github.com/labstack/echo"
	"project/handler/index"
	"project/handler/notebooks"
	"project/handler/accounts"
	"project/handler/auth"
	"project/handler/dev"
	"project/handler/top"
)

type Handler interface {
	Handle(e *echo.Group)
}

func NewIndexHandler() Handler {
	return &index.IndexHandler{}
}

func NewNotebookHandler() Handler {
	return &notebooks.NotebookHandler{}
}

func NewAccountHandler() Handler {
	return &accounts.AccountHandler{}
}

func NewNotebookPageHandler() Handler {
	return &notebooks.NotebookPageHandler{}
}

func NewAuthHandler() Handler {
	return &auth.AuthHandler{}
}

func NewAuthCallbackHandler() Handler {
	return &auth.OAuthCallbackHandler{}
}

func NewDevelopHandler() Handler {
	return &dev.DevelopHandler{}
}

func NewTopHandler() Handler {
	return &top.TopHandler{}
}