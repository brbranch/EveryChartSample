package middlewares

import (
	"encoding/gob"
	"github.com/labstack/echo"
	"net/http"
	"project/core"
	"project/client/oauth"
	session2 "project/client/session"
	"project/mapper"
)

func Gob() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			gob.Register(mapper.Account{})
			gob.Register(oauth.LinkedAccount{})
			return next(c)
		}
	}
}

func CheckSession() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			con := core.NewContext(c)
			session := session2.MustSession(con)
			account := session.GetAccount()
			if account == nil {
				return next(c)
			}
			// TODO: セッションの検証
			return next(c)
		}
	}
}

func AuthSession() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			con := core.NewContext(c)
			session := session2.MustSession(con)
			account := session.GetAccount()
			if account == nil {
				con.Infof("account is nil")
				return c.Redirect(http.StatusFound, "/top")
			}
			// TODO: アカウントの検証
			return next(c)
		}
	}
}
