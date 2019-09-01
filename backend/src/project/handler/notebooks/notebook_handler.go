package notebooks

import (
	"github.com/labstack/echo"
	"net/http"
	"project/mapper"
	"project/core"
	"project/usecase"
		"project/exception"
	"project/client/session"
	"project/middlewares"
	"project/util"
)

type NotebookHandler struct {
	accountId string
	notebookId string
}

func (i *NotebookHandler) Handle(g *echo.Group) {
	g.Use(i.prepare())
	g.GET("/new", i.new)
	g.GET("/:notebookId", i.getNotebook)
	g.GET("/:notebookId/edit", i.editNotebook)

	g.POST("/new", i.create, middlewares.JSONAPI)
	g.POST("/:notebookId", i.updateNotebook, middlewares.JSONAPI)
}

func (h *NotebookHandler) prepare() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			return next(c)
		}
	}
}

func (i *NotebookHandler) new(e echo.Context) error {
	ctx := core.NewContext(e)
	ac := session.MustSession(ctx).GetAccount()
	if ac == nil || ac.ID != i.accountId {
		return core.ErrorHTML(e, exception.NOT_ALLOWED)
	}

	util.SetTitle(e, "ノートの新規作成")

	return e.Render(http.StatusOK, "notebooks/new", nil)
}

func (i *NotebookHandler) create(e echo.Context) error {
	ctx := core.NewContext(e)
	notebook , err := BindNotebookFromRequest(e)
	if err != nil {
		return core.ErrorJSON(e, err)
	}

	service := usecase.NewNotebookService(ctx)
	if err := service.CreateNotebook(notebook); err != nil {
		return core.ErrorJSON(e, err)
	}

	return e.JSON(http.StatusOK, mapper.NotebookToJSON(notebook))
}

func (i *NotebookHandler) getNotebook(e echo.Context) error {
	ctx := core.NewContext(e)

	service := usecase.NewNotebookService(ctx)
	book , err := service.GetNotebook(i.accountId, i.notebookId)

	if err != nil {
		return core.ErrorHTML(e, err)
	}

	util.SetCardImage(e, book.CardImage())
	util.SetTitle(e, book.TitleString())
	util.SetDescription(e, book.DescriptionString())

	return e.Render(http.StatusOK, "notebooks/details", NotebookToJsonString(book));
}

func (i *NotebookHandler) updateNotebook(e echo.Context) error {
	ctx := core.NewContext(e)
	request , err := BindNotebookFromRequest(e)

	if err != nil {
		return core.ErrorJSON(e, err)
	}

	if !request.IsSame(i.notebookId) {
		ctx.Warningf("id is not match (id %s, requestId: %s)", i.notebookId, request.ID)
		return core.ErrorJSON(e, exception.INVALID_PARAM)
	}

	account := session.MustSession(ctx).GetAccount()
	service := usecase.NewNotebookService(ctx)

	if err := service.UpdateNotebook(account , request); err != nil {
		return core.ErrorJSON(e, err)
	}

	return e.JSON(http.StatusOK, mapper.NotebookToJSON(request))
}

func (i *NotebookHandler) editNotebook(e echo.Context) error {
	ctx := core.NewContext(e)
	account , err := session.MustSession(ctx).GetAndValidAccount(i.accountId)
	if err != nil {
		return core.ErrorHTML(e, err)
	}

	service := usecase.NewNotebookService(ctx)

	note , err := service.GetNotebook(account.ID, i.notebookId)
	if err != nil {
		return core.ErrorHTML(e, err)
	}

	util.SetTitle(e, "ノートの編集")

	return e.Render(http.StatusOK, "notebooks/edit", NotebookToJsonString(note));
}

