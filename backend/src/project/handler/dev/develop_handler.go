package dev

import (
	"github.com/labstack/echo"
	"os"
	"project/core"
	"project/client/foon"
	"net/http"
	"project/persistence/data"
	"strconv"
)

type DevelopHandler struct {

}

func (h *DevelopHandler) Handle(g *echo.Group) {
	if os.Getenv("ENVIRONMENT") != "local" {
		return;
	}
	g.GET("/accounts.json", h.getAllAccounts)
	g.GET("/notebooks.json", h.getAllNotebooks)
	g.GET("/pages.json", h.getAllPages)
	g.GET("/comments.json", h.getAllComments)
	g.GET("/error/:param", h.error)
	g.GET("/errorJson/:param", h.errorJson)
}

func (h DevelopHandler) errorJson(e echo.Context) error {
	st , err := strconv.ParseInt(e.Param("param"), 10, 64)
	if err != nil {
		panic(err.Error())
	}
	status := int(st)

	data := &struct {
		Error int
	}{
		Error: status,
	}

	return e.JSON(status, data)
}

func (h DevelopHandler) error(e echo.Context) error {
	st , err := strconv.ParseInt(e.Param("param"), 10, 64)
	if err != nil {
		panic(err.Error())
	}
	status := int(st)

	data := &struct {
		Error int
	}{
		Error: status,
	}

	return e.Render(status, "error/400" , data)
}

func (h *DevelopHandler) getAllAccounts(e echo.Context) error {
	ctx := core.NewContext(e)
	fn := foon.Must(ctx)

	comments := []*data.Account{}
	if err := fn.GetGroupByQuery(&comments, foon.NewConditions()); err != nil {
		return core.ErrorJSON(e, err)
	}
	return e.JSON(http.StatusOK, comments)
}

func (h *DevelopHandler) getAllNotebooks(e echo.Context) error {
	ctx := core.NewContext(e)
	fn := foon.Must(ctx)

	comments := []*data.Notebook{}
	if err := fn.GetGroupByQuery(&comments, foon.NewConditions()); err != nil {
		return core.ErrorJSON(e, err)
	}
	return e.JSON(http.StatusOK, comments)
}

func (h *DevelopHandler) getAllPages(e echo.Context) error {
	ctx := core.NewContext(e)
	fn := foon.Must(ctx)

	comments := []*data.NotebookPage{}
	if err := fn.GetGroupByQuery(&comments, foon.NewConditions()); err != nil {
		return core.ErrorJSON(e, err)
	}
	return e.JSON(http.StatusOK, comments)
}

func (h *DevelopHandler) getAllComments(e echo.Context) error {
	ctx := core.NewContext(e)
	fn := foon.Must(ctx)

	comments := []*data.Comment{}
	if err := fn.GetGroupByQuery(&comments, foon.NewConditions()); err != nil {
		return core.ErrorJSON(e, err)
	}
	return e.JSON(http.StatusOK, comments)
}

