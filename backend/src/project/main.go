package project

import (
	"context"
		"github.com/labstack/echo"
		"google.golang.org/appengine/log"
	"net/http"
	"os"
	"project/middlewares"
	"project/handler"
	"github.com/labstack/echo-contrib/session"
	"github.com/gorilla/sessions"
)

var e = createMux()

func init() {
	{
		ah := e.Group("/_ah")
		ah.GET("/start", func(c echo.Context) error { return c.String(http.StatusOK, "") })
	}
	e.HTTPErrorHandler = func(err error, c echo.Context) {
		data := &struct { Error int }{ Error: http.StatusInternalServerError }

		if he, ok := err.(*echo.HTTPError); ok {
			data.Error = he.Code
		}
		c.Render(data.Error, "error/400", data)
	}

	e.Use(session.Middleware(sessions.NewCookieStore([]byte(os.Getenv("SESSION_SEED")))))
	e.Use(middlewares.Gob())
	e.Use(middlewares.Recover())


	handler.NewAuthHandler().Handle(e.Group(""))
	handler.NewTopHandler().Handle(e.Group("/index"))
	handler.NewIndexHandler().Handle(e.Group("/home", middlewares.AuthSession()))
	handler.NewAuthCallbackHandler().Handle(e.Group("/authc"))
	if os.Getenv("ENVIRONMENT") == "local" {
		// デバッグ用の
		handler.NewDevelopHandler().Handle(e.Group("/dev"))
	}

	accountGroup := e.Group("/:accountId")
	handler.NewAccountHandler().Handle(accountGroup)
	bookGroup := accountGroup.Group("/notebooks")
	handler.NewNotebookHandler().Handle(bookGroup)
	pageGroup := bookGroup.Group("/:notebookId/pages")
	handler.NewNotebookPageHandler().Handle(pageGroup)

}

func createMux() *echo.Echo {
	e := echo.New()
	e.Use(middlewares.UseAppEngine())
	tmpl := &middlewares.Template{}
	e.Renderer = tmpl
	e.HTTPErrorHandler = func(e error, c echo.Context) {
		if cc, ok := c.Get(middlewares.AppEngine).(context.Context); ok {
			log.Warningf(cc, "error is occerred: %+e", e)
		}
		c.JSON(http.StatusInternalServerError, e.Error()) // ブラウザ画面へ
	}
	http.Handle("/", e)
	return e
}
