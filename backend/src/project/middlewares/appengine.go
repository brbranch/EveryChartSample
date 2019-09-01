package middlewares

import (
	"github.com/labstack/echo"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
)

const AppEngine = "appengine"
const CurrentVersionNum = 1

var formatLog = `RequestInformation:
Referer: %s
Remote address: %s
Content-Type: %s
HTTP method: %s
User Agent: %s
host: %s
path: %s
query string: %s
`

func UseAppEngine() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			ctx := appengine.NewContext(c.Request())
			c.Set(AppEngine, ctx)

			// リクエスト情報を記述
			req := c.Request()
			header := req.Header
			log.Infof(ctx, formatLog,
				req.Referer(),
				req.RemoteAddr,
				header.Get("Content-Type"),
				req.Method, header.Get("User-Agent"),
				req.Host,
				req.URL.Path,
				req.URL.RawQuery)
			return next(c)
		}
	}
}