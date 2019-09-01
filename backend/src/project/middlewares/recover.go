package middlewares

import (
	"github.com/labstack/echo"
	"project/core"
	"fmt"
	"runtime"
)

func Recover() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			defer func() {
				if r := recover(); r != nil {
					err, ok := r.(error)
					if !ok {
						err = fmt.Errorf("%v", r)
					}
					stackSize := 4 << 10
					stack := make([]byte, stackSize)
					length := runtime.Stack(stack, true)
					con := core.NewContext(c)
					con.Errorf("[PANIC RECOVER] %+v %s \n", err, stack[:length])
					c.Error(err)
				}
			}()
			return next(c)
		}
	}
}
