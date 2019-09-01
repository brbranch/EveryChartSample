package top

import (
	"github.com/labstack/echo"
	"project/core"
	"project/usecase"
	"project/mapper"
	"project/client/session"
	"net/http"
	"project/middlewares"
)

type TopHandler struct {

}

func (t TopHandler) Handle(e *echo.Group) {
	e.GET("/pages.json", t.getRecentComments, middlewares.JSONAPI)
	e.GET("/notebooks.json", t.getRecentBooks, middlewares.JSONAPI)
}

func (t TopHandler) getRecentComments(e echo.Context) error {
	ctx := core.NewContext(e)
	cursor := e.QueryParam("cursor")

	service := usecase.NewNotebookPageService(ctx)
	page, nextCursor, err := service.GetRecentPages(cursor)

	if err != nil {
		return core.ErrorJSON(e, err)
	}

	ac := session.MustSession(ctx).GetAccount()

	res := &RecentPageResponse{
		Items: mapper.NotebookPageMapper{}.ToJsonInstances(page, ac),
		NextCursor: nextCursor,
	}

	return e.JSON(http.StatusOK, res)
}

func (t TopHandler) getRecentBooks(e echo.Context) error {
	ctx := core.NewContext(e)
	cursor := e.QueryParam("cursor")

	service := usecase.NewNotebookService(ctx)
	page, nextCursor, err := service.GetRecentNotebooks(cursor)

	if err != nil {
		return core.ErrorJSON(e, err)
	}


	res := &RecentNotebookResponse{
		Items: mapper.NotebooksToJSON(page),
		NextCursor: nextCursor,
	}

	return e.JSON(http.StatusOK, res)
}