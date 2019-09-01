package auth

import (
	"github.com/labstack/echo"
	"project/core"
	"project/client/oauth"
	"net/http"
	"project/usecase"
)

const AuthSessionKey string = "AuthResultMessage"

type OAuthCallbackHandler struct {
}

func (a OAuthCallbackHandler) Handle(e *echo.Group) {
	e.GET("/twitter", a.authTwitter)
}

func (OAuthCallbackHandler) authTwitter(e echo.Context) error {
	ctx := core.NewContext(e)
	verifer := e.QueryParam("oauth_verifier")
	client := oauth.NewAuthClient(oauth.Twitter, ctx)
	account , err := client.GetAccount(verifer)

	if err != nil {
		return handleError(e, ctx, err)
	}

	service := usecase.NewLoginService(ctx)
	if ac , err := service.LoginOrSignup(account); err != nil {
		return handleError(e, ctx, err)
	} else {
		ctx.Infof("login (userID: %s)", ac.ID)
		return e.Redirect(http.StatusFound, "/home")
	}

	return e.Redirect(http.StatusFound, "/top")
}
