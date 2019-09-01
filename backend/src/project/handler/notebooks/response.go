package notebooks

import (
	"encoding/json"
	"project/mapper"
	"project/model/account"
	"project/model/notebook"
	"project/model/page"
)

type EditPage struct {
	IsNew bool                `json:"isNew"`
	Page  mapper.NotebookPage `json:"page"`
}

type NotebookResponse struct {
	Items      []*mapper.Notebook `json:"items"`
	NextCursor string             `json:"next"`
}

type CommentCollection struct {
	Comments   []*mapper.PageComment `json:"comments"`
	NextCursor string                `json:"next"`
}

type NotebookPageResponse struct {
	Items      []mapper.NotebookPage `json:"items"`
	NextCursor string                 `json:"next"`
}

func NotebookToJsonString(book *notebook.Notebook) string {
	str, err := json.Marshal(mapper.NotebookToJSON(book))
	if err != nil {
		return "{}"
	}
	return string(str)
}

func NotebookPageToJsonString(page *page.Page, ac *account.Account) string {
	str, err := json.Marshal(mapper.NotebookPageMapper{}.ToJson(page, ac))
	if err != nil {
		return "{}"
	}
	return string(str)
}

func (e EditPage) ToJsonString() string {
	str, err := json.Marshal(e)
	if err != nil {
		return "{}"
	}
	return string(str)
}
