package core

import (
	"github.com/labstack/echo"
	"net/http"
	"project/exception"
	"project/util"
)

func StatusOKJSON(e echo.Context, response interface{}) error {
	return e.JSON(http.StatusOK, response)
}

func ErrorJSON(e echo.Context, err error) error {
	status := HttpStauts(err)
	response := map[string]interface{}{
		"instance": e.Path(),
		"status": status,
		"reason": err.Error(),
	}
	con := NewContext(e)
	con.Errorf("Response Error (reason :%+v)", err)

	return e.JSON(status, response)
}

func ErrorString(e echo.Context, err error) error {
	con := NewContext(e)
	con.Errorf("Response Error (reason :%+v)", err)
	status := HttpStauts(err)
	return e.String(status, "")
}

func ErrorHTML(e echo.Context, err error) error {
	con := NewContext(e)
	con.Errorf("Response Error (reason :%+v)", err)

	status := HttpStauts(err)

	data := &struct {
		Error int
	}{
		Error: status,
	}
	util.SetTitle(e, "エラー")

	return e.Render(status, "error/400" , data)
}

func HttpStauts(err error) int {
	if exception.NO_SUCH_ENTITY.Is(err) {
		return http.StatusNotFound
	}
	if exception.NOT_AUTHORIZED.Is(err) {
		return http.StatusForbidden;
	}
	if exception.NOT_ALLOWED.Is(err) {
		return http.StatusForbidden;
	}
	if exception.INVALID_ID.Is(err) {
		return http.StatusBadRequest
	}
	if exception.INVALID_PARAM.Is(err) {
		return http.StatusBadRequest
	}
	if exception.NOT_LOGGEDIN.Is(err) {
		return http.StatusUnauthorized
	}
	if exception.INVALID_REQUEST.Is(err) {
		return http.StatusBadRequest
	}
	if exception.INVALID_SESSION.Is(err) {
		return http.StatusBadRequest
	}
	if exception.ALREADY_EXISTS.Is(err) {
		return http.StatusBadRequest
	}
	return http.StatusInternalServerError
}
