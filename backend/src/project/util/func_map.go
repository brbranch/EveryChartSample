package util

import (
	"html/template"
	"math/rand"
	"time"
)

var randSrc = rand.NewSource(time.Now().UnixNano())

var FuncMap = template.FuncMap{
	"safeHTML": func(text string) template.HTML { return template.HTML(text) },
}
