package util

import "github.com/labstack/echo"

func SetTitle(c echo.Context, title string) {
	c.Set("title", title)
}

func SetCardImage(c echo.Context, image string) {
	c.Set("cardImage", image)
}

func SetDescription(c echo.Context, description string) {
	c.Set("desc", description)
}

func SetCardPath(c echo.Context, path string) {
	c.Set("path", path)
}