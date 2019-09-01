package notebooks

import (
	"github.com/labstack/echo"
	"project/model/notebook"
	"project/core"
	"encoding/json"
	"project/mapper"
	"project/client/session"
	"project/model/page"
	"project/exception"
)

func BindNotebookFromRequest(e echo.Context) (*notebook.Notebook, error) {
	ctx := core.NewContext(e)
	note := &mapper.Notebook{}
	if err := e.Bind(note); err != nil {
		ctx.Warningf("failed to bind data (reason: %+v)", err)
		return nil, err
	}

	js , _ := json.Marshal(note)
	ctx.Infof("json: %v", string(js))

	ac := session.MustSession(ctx).GetAccount()
	notebook := mapper.NewNotebookFromJSON(note, ac)

	js2 , _ := json.Marshal(notebook)
	ctx.Infof("json: %v", string(js2))
	return notebook, nil
}

func BindCommentFromRequest(e echo.Context) (*page.Comment, error) {
	ctx := core.NewContext(e)
	note := &mapper.PageComment{}
	if err := e.Bind(note); err != nil {
		ctx.Warningf("failed to bind data (reason: %+v)", err)
		return nil, err
	}
	ac := session.MustSession(ctx).GetAccount()
	if ac != nil {
		if note.CommentID != ac.CommentID && note.Evaluates {
			ctx.Warningf("comment id is not same (request: %s, account: %s)", note.CommentID, ac.CommentID)
			return nil, exception.INVALID_REQUEST
		}
	}
	return note.ToModel(), nil
}

func BindSessionId(e echo.Context) (string, error) {
	ctx := core.NewContext(e)
	commentId := e.Param("commentId")
	ac := session.MustSession(ctx).GetAccount()
	if ac != nil {
		commentId = ac.CommentID
	}
	if commentId == "" {
		return "" , exception.INVALID_REQUEST
	}

	return commentId, nil
}