package middlewares

import (
	"fmt"
	"github.com/labstack/echo"
	"html/template"
	"io"
	"project/core"
	"project/client/session"
	"project/util"
	"strings"
	"os"
)

type Template struct {
}

func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	cont := fmt.Sprintf("templates/%s.html", name)
	tmp := template.Must(template.New("main").Funcs(util.FuncMap).ParseFiles("templates/layouts/base.html", cont))

	con := core.NewContext(c)
	sess := session.MustSession(con)
	ac := sess.GetAccount()
	loginId := ""
	commentId := ""
	image := ""
	if ac != nil {
		loginId = ac.ID
		commentId = ac.CommentID
		image = ac.Image()
	}
	ogType := "article"
	path := c.Request().URL.Path
	if _path := c.Get("path"); _path != nil {
		path = fmt.Sprintf("%s", _path)
	}
	if path == "/top" || path == "" {
		ogType = "website"
		path = ""
	}
	cardImage := fmt.Sprintf("https://storage.googleapis.com/%s/%s/ogp_top.png", os.Getenv("BUCKET"), os.Getenv("GCSPATH"))
	if img := c.Get("cardImage"); img != nil {
		i := fmt.Sprintf("%s", img)
		if strings.HasPrefix(i , "http") {
			cardImage = i
		} else {
			cardImage = fmt.Sprintf("https://storage.googleapis.com/%s/%s/%s", os.Getenv("BUCKET"), os.Getenv("GCSPATH"), img)
		}
	}

	result := map[string]interface{}{
		"SessionID": loginId,
		"CommentID" : commentId,
		"Data": data,
		"Image": image,
		"OgType": ogType,
		"CardImage": cardImage,
		"Url": fmt.Sprintf("https://everychart.site%s", path),
		"Title": "EveryChart -なんでもチャートでランク付けしよう-",
		"CardTitle": "EveryChart -なんでもチャートでランク付けしよう-",
		"Desc": "EveryChartは、誰でも好きな口コミ評価ページを作れるサービスです。好きな料理も読んだ本の感想も、なんでもレーダーチャートで評価してランク付けしたり、口コミ評価をすることができます。",
	}

	if title := c.Get("title"); title != nil {
		result["Title"] = fmt.Sprintf("%s -EveryChart なんでもチャートでランク付けしよう", title)
		result["CardTitle"] = title
	}

	if desc := c.Get("desc"); desc != nil {
		result["Desc"] = desc
	}


	return tmp.ExecuteTemplate(w, "base", result)
}
