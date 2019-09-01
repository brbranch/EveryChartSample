package index

import (
	"github.com/labstack/echo"
	"net/http"
	"project/core"
	"project/client/session"
	"project/usecase"
	"project/util"
	"fmt"
)

type IndexHandler struct {
}

func (i *IndexHandler) Handle(a *echo.Group) {
	a.GET("", i.index)
	a.GET("/settings", i.settings)
	a.POST("/goodbye", i.goodbye)
}


func (i IndexHandler) getRecentPost(e echo.Context) error {
	return nil
}

func (i IndexHandler) index(e echo.Context) error {
	con := core.NewContext(e)
	ac := session.MustSession(con).GetAccount()
	util.SetCardImage(e, "ogp_account.png")
	util.SetTitle(e, ac.Title())
	util.SetDescription(e, ac.DescriptionString())
	util.SetCardPath(e, fmt.Sprintf("/%s", ac.ID))
	return e.Render(http.StatusOK, "main/index", asJsonString(ac))
}

func (i IndexHandler) settings(e echo.Context) error {
	con := core.NewContext(e)
	ac := session.MustSession(con).GetAccount()
	return e.Render(http.StatusOK, "main/index", asJsonString(ac))
}

func (i IndexHandler) goodbye(e echo.Context) error {
	con := core.NewContext(e)
	service := usecase.NewAccountService(con)
	if err := service.DisableAll(); err != nil {
		return core.ErrorJSON(e, err)
	}
	return e.JSON(http.StatusOK, map[string]interface{}{ "result": true })
}
