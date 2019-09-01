package notebooks

import (
	"github.com/labstack/echo"
	"project/core"
	"project/usecase"
	"net/http"
	"project/mapper"
	"project/client/session"
	"project/exception"
	"project/middlewares"
	"project/util"
)

type NotebookPageHandler struct {
	accountId string
	notebookId string
	pageId string
}

func (h *NotebookPageHandler) Handle(e *echo.Group) {
	e.Use(h.prepare())
	e.GET("/new", h.new)
	e.GET("/:pageId/edit", h.edit)
	e.GET("/:pageId", h.get)

	e.POST("", h.create, middlewares.JSONAPI)
	e.PUT("/:pageId", h.update, middlewares.JSONAPI)
	e.GET("/instances.json", h.instances, middlewares.JSONAPI)
	e.GET("/:pageId/newComment/:commentId", h.newComment, middlewares.JSONAPI)
}

func (h *NotebookPageHandler) prepare() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			return next(c)
		}
	}
}

func (h *NotebookPageHandler) get(e echo.Context) error {
	ctx := core.NewContext(e)
	service := usecase.NewNotebookPageService(ctx)
	ac := session.MustSession(ctx).GetAccount()

	page, err := service.Get(h.accountId, h.notebookId, h.pageId)

	if err != nil {
		return core.ErrorHTML(e, err)
	}

	util.SetTitle(e, page.TitleString())
	util.SetDescription(e, page.DescriptionString())
	util.SetCardImage(e, page.CardImage())

	return e.Render(http.StatusOK, "pages/details", NotebookPageToJsonString(page, ac))
}


func (h *NotebookPageHandler) instances(e echo.Context) error {
	ctx := core.NewContext(e)
	service := usecase.NewNotebookPageService(ctx)
	ac := session.MustSession(ctx).GetAccount()
	cursor := e.QueryParam("cursor")

	pages, next , err := service.GetAllPages(h.accountId, h.notebookId, cursor)
	if err != nil {
		return core.ErrorJSON(e, err)
	}

	resp := &NotebookPageResponse{
		Items: mapper.NotebookPageMapper{}.ToJsonInstances(pages, ac),
		NextCursor: next,
	}

	return e.JSON(http.StatusOK, resp)
}

func (h *NotebookPageHandler) new(c echo.Context) error {
	ctx := core.NewContext(c)
	service := usecase.NewNotebookPageService(ctx)
	ac := session.MustSession(ctx).GetAccount()

	page, err := service.NewPage(h.accountId, h.notebookId)

	if err != nil {
		return core.ErrorHTML(c, err)
	}

	response := EditPage{
		IsNew: true,
		Page: mapper.NotebookPageMapper{}.ToJson(page, ac),
	}

	util.SetTitle(c, "新しいチャートの作成")

	return c.Render(http.StatusOK, "pages/edit", response.ToJsonString())
}

func (h *NotebookPageHandler) edit(e echo.Context) error {
	ctx := core.NewContext(e)
	service := usecase.NewNotebookPageService(ctx)
	ac := session.MustSession(ctx).GetAccount()

	page, err := service.EditPage(h.accountId, h.notebookId, h.pageId)

	if err != nil {
		return core.ErrorHTML(e, err)
	}

	response := EditPage{
		IsNew: false,
		Page: mapper.NotebookPageMapper{}.ToJson(page, ac),
	}

	util.SetTitle(e, "チャートの編集")

	return e.Render(http.StatusOK, "pages/edit", response.ToJsonString())
}

func (h *NotebookPageHandler) create(c echo.Context) error {
	req := &NotebookPageEditReqeust{}

	if err := req.Bind(c); err != nil {
		return core.ErrorJSON(c, err)
	}

	page := req.NotebookPage.ToModel()
	ctx := core.NewContext(c)
	service := usecase.NewNotebookPageService(ctx)
	ac := session.MustSession(ctx).GetAccount()

	if model, err := service.Create(page, req.Base64Image); err != nil {
		return core.ErrorJSON(c, err)
	} else {
		return c.JSON(http.StatusOK, mapper.NotebookPageMapper{}.ToJson(model, ac))
	}
}

func (h *NotebookPageHandler) update(c echo.Context) error {
	req := &NotebookPageEditReqeust{}

	if err := req.Bind(c); err != nil {
		return core.ErrorJSON(c, err)
	}

	page := req.NotebookPage.ToModel()
	ctx := core.NewContext(c)
	service := usecase.NewNotebookPageService(ctx)
	ac := session.MustSession(ctx).GetAccount()

	if model, err := service.Update(page, req.Base64Image); err != nil {
		return core.ErrorJSON(c, err)
	} else {
		return c.JSON(http.StatusOK, mapper.NotebookPageMapper{}.ToJson(model, ac))
	}
}


func (h *NotebookPageHandler) newComment(e echo.Context) error {
	ctx := core.NewContext(e)
	commentId := e.Param("commentId")
	ac := session.MustSession(ctx).GetAccount()
	if ac != nil {
		commentId = ac.CommentID
	}
	if commentId == "" {
		return core.ErrorJSON(e, exception.INVALID_PARAM)
	}
	service := usecase.NewCommentService(ctx)

	comment, err := service.GetOrCreate(h.accountId, h.notebookId, h.pageId, commentId, true)

	if err != nil {
		return core.ErrorHTML(e, err)
	}

	return e.JSON(http.StatusOK, mapper.CommentMapper.ToEntity(comment, ac))
}

