package data

import (
	"project/client/foon"
	"project/model/page"
	)

type NotebookPage struct {
	Entity
	__kind       string                    `foon:"collection,Page"`
	Parent       *foon.Key                 `foon:"parent"`
	Author       Author                    `firestore:"author"`
	AccountID    string                    `firestore:"accountId"`
	NotebookID   string                    `firestore:"notebookId"`
	IPAddress    string                    `firestore:"ipAddress"`
	Title        string                    `firestore:"title"`
	Description  string                    `firestore:"description"`
	Image        string                    `firestore:"imageURL"`
	LikeCount    int                       `firestore:"likeCount"`
	Adult        bool                      `firestore:"adult"`
	Average      float64                   `firestore:"average"`
	Disabled     bool                      `firestore:"disabled"`
	Priavte      bool					   `firestore:"private"`
	CanComment   bool `firestore:"canComment"`
	CanEvaluate  bool `firestore:"canEvaluate"`
	CommentCount int                       `firestore:"commentCount"`
	ChartCount   int                       `firestore:"chartCount"`
	Posts        int                       `firestore:"posts"`
}

type CommentSummary struct {
	AuthorID string `firestore:"authorId"`
	Type     int    `firestore:"type"`
	Values   []int  `firestore:"values"`
	Disabled bool   `firestore:"disabled"`
}

type NotebookPageItem struct {
	Name  string `firestore:"name"`
	Value int    `firestore:"value"`
}

type NotebookPageAverage struct {
	Name  string `firestore:"name"`
	Total int    `firestore:"total"`
	Count int    `firestore:"count"`
}

var NotebookPageMapper notebookPageMapper = notebookPageMapper{}

type notebookPageMapper struct {
}

// Get用の不完全なページ
func NewNotebookPageById(accountId string, notebookId string, pageId string) *NotebookPage {
	return NewNotebookPage(NewNotebookById(accountId, notebookId), pageId)
}

// Get用の不完全なページ
func NewNotebookPage(book *Notebook, id string) *NotebookPage {
	return &NotebookPage{
		Entity:     NewEntity(id),
		Parent:     foon.NewKey(book),
		AccountID:  book.AccountID,
		NotebookID: book.ID,
		Disabled:   false,
	}
}

func (n notebookPageMapper) ToEntity(model *page.Page) *NotebookPage {
	notebook := NotebookMapper.ToEntity(model.Notebook)
	res := NewNotebookPage(notebook, model.PageID)
	res.ID = model.PageID
	res.AccountID = model.Author.AuthorID.String()
	res.Author = notebookCommentMapper{}.NewAuthor(model.Author)
	res.NotebookID = model.Notebook.ID
	res.Title = model.Title
	res.Description = model.Description
	res.Image = model.Image
	res.CommentCount = model.CommentCount()
	res.ChartCount = model.ChartCounts()
	res.LikeCount = model.LikeCount()
	res.CreatedAt = model.CreatedAt
	res.UpdatedAt = model.UpdatedAt
	res.Disabled = model.Disabled
	res.Priavte = model.Private
	res.CanComment = model.CanComment
	res.CanEvaluate = model.CanEvaluate
	return res
}

func (n NotebookPage) ToModel(account *Account, note *Notebook) *page.Page {
	items := []page.Item{}
	res := page.NewPage(note.AsModelWithAccount(account.ToModel()))
	res.Author = n.Author.ToModel()
	res.PageID = n.ID
	res.Title = n.Title
	res.Description = n.Description
	res.Image = n.Image
	res.Items = items
	res.CreatedAt = n.CreatedAt
	res.UpdatedAt = n.UpdatedAt
	res.Disabled = n.Disabled
	res.Private = n.Priavte
	res.CanComment = n.CanComment
	res.CanEvaluate = n.CanEvaluate

	return res
}


func (n NotebookPageItem) ToModel() page.Item {
	return page.Item{n.Name, page.Evaluate(n.Value)}
}
