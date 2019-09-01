package data

import (
	"project/client/foon"
	"project/model/page"
	"time"
)

type Comment struct {
	Entity
	__kind    string    `foon:"collection,Comment"`
	Parent    *foon.Key `foon:"parent"`
	Author    Author    `firestore:"author"`
	Evaluates bool      `firestore:"evaluates"`
	Values    []int     `firestore:"values"`
	Comment   string    `firestore:"comment"`
	Disabled  bool      `firestore:"disabled"`
}

type Author struct {
	AuthorID string `firestore:"authorId"`
	Name     string `firestore:"name"`
	Image    string `firestore:"image"`
}

func (n Comment) ToModel() *page.Comment {
	return &page.Comment{
		ID:        page.PageCommentId(n.ID),
		Author:    n.Author.ToModel(),
		Evaluates: n.Evaluates,
		Values:    n.AsEvaluates(),
		Comment:   n.Comment,
		IsNew:     false,
		Disabled:  n.Disabled,
		Created:   n.CreatedAt,
	}
}

func (n Comment) AsEvaluates() []page.Evaluate {
	ev := []page.Evaluate{}
	for _, num := range n.Values {
		ev = append(ev, page.Evaluate(num))
	}
	return ev
}

func (n *Comment) Clear() {

}

func (n Author) ToModel() page.Author {
	return page.NewAuthor(n.AuthorID, n.Image, n.Name)
}

var NotebookCommentMapper notebookCommentMapper = notebookCommentMapper{}

type notebookCommentMapper struct {
}

func NewCommentById(accountId string, notebookId string, pageId string, commentId string) *Comment {
	return NewComment(NewNotebookPageById(accountId, notebookId, pageId), commentId)
}

func NewComment(p *NotebookPage, id string) *Comment {
	return &Comment{
		Entity:    NewEntity(id),
		Parent:    foon.NewKey(p),
		Disabled:  false,
		Evaluates: false,
	}
}

func (notebookCommentMapper) NewAuthor(author page.Author) Author {
	return Author{
		AuthorID: author.AuthorID.String(),
		Name:     author.Name,
		Image:    author.Image,
	}
}

func (notebookCommentMapper) NewEntity(parent *page.Page) *Comment {
	entity := NotebookPageMapper.ToEntity(parent)
	return &Comment{
		Entity:    NewEntity(""),
		Parent:    foon.NewKey(entity),
		Disabled:  false,
		Evaluates: false,
	}
}

func (n notebookCommentMapper) ToEntity(parent *page.Page, model *page.Comment) *Comment {
	entity := NotebookPageMapper.ToEntity(parent)
	return n.ToEntityWithKey(foon.NewKey(entity), model)
}

func (n notebookCommentMapper) ToEntityWithKey(parent *foon.Key, model *page.Comment) *Comment {
	entity := &Comment{
		Entity: NewEntity(model.ID.String()),
		Parent: parent,
	}
	entity.ID = model.ID.String()
	entity.Author = n.NewAuthor(model.Author)
	entity.Evaluates = model.Evaluates
	entity.Values = model.EvaluateValues()
	entity.Comment = model.Comment
	entity.Disabled = model.Disabled
	entity.CreatedAt = model.Created
	entity.UpdatedAt = time.Now()
	return entity
}

func (n notebookCommentMapper) ToEntities(parent *page.Page, models []*page.Comment) []*Comment {
	res := []*Comment{}
	for _, model := range models {
		res = append(res, n.ToEntity(parent, model))
	}
	return res
}

func (n notebookCommentMapper) ToModels(comments []*Comment) []*page.Comment {
	res := []*page.Comment{}
	for _, comment := range comments {
		res = append(res, comment.ToModel())
	}
	return res
}
