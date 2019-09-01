package core

import (
	"context"
	"github.com/labstack/echo"
	"net/http"
	"project/core/logger"
)

type Context interface {
	context.Context
	Echo() echo.Context
	Debugf(format string, args ...interface{})
	Infof(format string, args ...interface{})
	Warningf(format string, args ...interface{})
	Errorf(format string, args ...interface{})
	WrapErrorf(err error, format string, args ...interface{}) error
	Trace(message string)
	Request() *http.Request
	Warning(message string)
}

type ctx struct {
	context.Context
	echo   echo.Context
	logger *logger.Logger
}

func NewContext(e echo.Context) Context {
	if cc, ok := e.Get("appengine").(context.Context); !ok {
		panic("AppEngine is not init")
	} else {
		return &ctx{
			Context: cc,
			echo:    e,
			logger:  logger.NewLoggerWithCaller(cc, 3),
		}
	}
}

func (e *ctx) Echo() echo.Context {
	return e.echo
}

func (e *ctx) Trace(message string) {
	e.logger.Tracef("%s", message)
}

func (e *ctx) Request() *http.Request {
	return e.echo.Request()
}

func (e *ctx) Warning(message string) {
	e.logger.Warningf("%s", message)
}

func (e *ctx) Debugf(format string, args ...interface{}) {
	e.logger.Infof(format, args...)
}

func (e *ctx) Infof(format string, args ...interface{}) {
	e.logger.Infof(format, args...)
}

func (e *ctx) Warningf(format string, args ...interface{}) {
	e.logger.Warningf(format, args...)
}

func (e *ctx) Errorf(format string, args ...interface{}) {
	e.logger.Errorf(format, args...)
}

func (e *ctx) WrapErrorf(err error, format string, args ...interface{}) error {
	e.logger.Warningf(format, args...)
	e.logger.Errorf("Error is occurred: \n%+v", err)
	return err
}

