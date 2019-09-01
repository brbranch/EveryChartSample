package middlewares

import (
	"github.com/labstack/echo"
	"project/core"
	"project/exception"
		"os"
)

func JsonAPI() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			ctx := core.NewContext(c)
			req := c.Request()

			if os.Getenv("HOSTNAME") == "localhost" {
				return next(c)
			}

			referer := req.Referer()
			if referer == "" {
				ctx.Warningf("this JSON API is allowed only this site.")
				return core.ErrorJSON(c, exception.NOT_ALLOWED)
			}

			// TODO: CORS対策 (これ使わなくてもechoのデフォルトのmiddlewareでやるでもいいかも)

			return next(c)
		}
	}
}

var JSONAPI = JsonAPI()
