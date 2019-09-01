package accounts

import (
	"github.com/labstack/echo"
	"project/exception"
	"project/usecase"
	"net/http"
	"project/util"
	"fmt"
	"project/core"
)

type AccountHandler struct {
}

func (a *AccountHandler) Handle(e *echo.Group) {
	e.Use(a.prepare())
	e.GET("", a.get)
}

func (h *AccountHandler) prepare() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			return next(c)
		}
	}
}

func (a AccountHandler) get(e echo.Context) error {
	accountId := e.Param("accountId")
	if accountId == "" {
		return core.ErrorHTML(e, exception.NO_SUCH_ENTITY)
	}
	ctx := core.NewContext(e)
	service := usecase.NewAccountService(ctx)

	account ,err := service.GetAccountById(accountId)

	if err != nil {
		return core.ErrorHTML(e, err)
	}

	util.SetCardImage(e, "ogp_account.png")
	util.SetTitle(e, account.Title())
	util.SetDescription(e, account.DescriptionString())
	util.SetCardPath(e, fmt.Sprintf("/%s", account.ID))

	return e.Render(http.StatusOK, "main/index", asJsonString(account))
}

