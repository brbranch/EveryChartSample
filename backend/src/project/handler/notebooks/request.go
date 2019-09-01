package notebooks

import (
	"project/mapper"
	"github.com/labstack/echo"
	"project/core"
	)

type NotebookPageEditReqeust struct {
	NotebookPage *mapper.NotebookPage `json:"page"`
	Base64Image string `json:"image"`
}

func (n *NotebookPageEditReqeust) Bind(e echo.Context) error {
	ctx := core.NewContext(e)
	if err := e.Bind(n); err != nil {
		ctx.Warningf("failed to bind data (reason: %+v)", err)
		return err
	}
	return nil
}
