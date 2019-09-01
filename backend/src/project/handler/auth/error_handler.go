package auth

import (
	"github.com/labstack/echo"
	"project/core"
	"project/exception"
	"net/http"
	session2 "project/client/session"
)

func handleError(e echo.Context, ctx core.Context, err error) error {
	if exception.INVALID_SESSION.Is(err) {
		return e.Redirect(http.StatusFound, "/top")
	}
	ctx.Warningf("failed to get account (reason: %+v)", err)
	session := session2.MustSession(ctx)
	session.PutAndSave(AuthSessionKey, "error")

	return e.Redirect(http.StatusFound, "/top")
}
