package auth

import (
	"github.com/labstack/echo"
	"project/core"
	"project/client/oauth"
	"net/http"
	session2 "project/client/session"
)

type AuthHandler struct {
}

func (a *AuthHandler) Handle(e *echo.Group) {
	e.GET("/", a.handle)
	e.GET("/top/info", a.info)
	e.GET("/top/terms", a.terms)
	e.GET("/top/policy", a.terms)
	e.GET("/top", a.login)
	e.GET("/logout", a.logout)
	e.GET("/auth/twitter/:id", a.authTwitter)
}

func (i AuthHandler) terms(e echo.Context) error {
	return e.Render(http.StatusOK, "main/terms", nil)
}

func (i AuthHandler) info(e echo.Context) error {
	return e.Render(http.StatusOK, "main/terms", nil)
}

func (a *AuthHandler) handle(e echo.Context) error {
	ctx := core.NewContext(e)
	sess := session2.MustSession(ctx)
	if sess.GetAccount() == nil {
		return e.Render(http.StatusOK, "auth/top", &LoginResponse{Error:sess.GetFlush(AuthSessionKey)})
	}
	return e.Redirect(http.StatusFound, "/home")
}

func (a *AuthHandler) logout(e echo.Context) error {
	ctx := core.NewContext(e)
	sess := session2.MustSession(ctx)
	sess.Logout()

	return e.Redirect(http.StatusFound, "/top")
}

func (a *AuthHandler) login(e echo.Context) error {
	session := session2.MustSession(core.NewContext(e))
	return e.Render(http.StatusOK, "auth/top", &LoginResponse{Error:session.GetFlush(AuthSessionKey)})
}

func (a *AuthHandler) authTwitter(e echo.Context) error {
	ctx := core.NewContext(e)
	client := oauth.NewAuthClient(oauth.Twitter, ctx)
	requestUri, err := client.GetAuthUrl(e.Param("id"))

	if err != nil {
		return core.ErrorHTML(e, err)
	}

	return e.Redirect(http.StatusFound, requestUri)
}
