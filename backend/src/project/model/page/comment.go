package page

import (
	"fmt"
	"project/model"
	"project/model/account"
	"time"
)

type Comment struct {
	ID        PageCommentId
	Author    Author
	PostId    int        // 連番
	Evaluates bool       // 評価があるか
	Values    []Evaluate // 評価
	Likes
	Comment  string // コメント
	IsNew    bool
	Disabled bool
	Created  time.Time
}

type Evaluate int
type PageCommentId string

func accountId(author *account.Account) string {
	if author == nil {
		return ""
	}
	return author.ID
}

func NewComment(commentId string, page *Page, author *account.Account) *Comment {
	return &Comment{
		ID:        PageCommentId(commentId),
		Author:    NewAuthorWithAcount(author),
		Evaluates: true,
		Values:    make([]Evaluate, page.ItemCount()),
		Likes:     NewLikes([]string{}),
		IsNew:     true,
		Comment:   "",
		Disabled:  false,
		Created:   time.Now(),
	}
}

func NewCommentOnly(commentId string, page *Page, author *account.Account) *Comment {
	return &Comment{
		ID:        PageCommentId(fmt.Sprintf("%s-%d", commentId, 0)),
		Author:    NewAuthorWithAcount(author),
		Evaluates: false,
		Values:    make([]Evaluate, page.ItemCount()),
		Likes:     NewLikes([]string{}),
		IsNew:     true,
		Comment:   "",
		Disabled:  false,
		Created:   time.Now(),
	}
}

func (p Comment) HasComment() bool {
	return len(p.Comment) > 0
}

func (p PageCommentId) String() string {
	return string(p)
}

func (p *Comment) SyncCoreData(entity model.IEntity) {
}

func (p Comment) HasValue() bool {
	return p.Evaluates && len(p.Values) > 0
}

func (p Comment) GetAuthor() Author {
	if p.Disabled {
		return Unsubscriber()
	}
	return p.Author
}

func (e Evaluate) Value() int {
	return int(e)
}

func (p Comment) GetEvaluates() bool {
	if p.Disabled {
		return false
	}
	return p.Evaluates
}

func (p Comment) CommentString() string {
	if p.Disabled {
		return ""
	}
	return p.Comment
}

func (e Evaluate) EffectiveValue() int {
	if e > 5 {
		return 5
	}
	return e.Value()
}

func (e Comment) Type() CommentType {
	if e.Evaluates {
		if e.HasComment() {
			return CommentTypeBoth
		}
		return CommentTypeEvaluateOnly
	}
	if e.HasComment() {
		return CommentTypeCommentOnly
	}
	return CommentTypeUnknown
}

func (e Comment) EvaluateValues() []int {
	res := []int{}
	for _, num := range e.Values {
		res = append(res, num.Value())
	}
	return res
}

func (e Comment) ChartItem() ChartItem {
	return ChartItem{
		AuthorID:    e.Author.AuthorID.String(),
		Disabled:    e.Disabled,
		CommentType: e.Type(),
		Values:      e.Values,
	}
}

func (e *Comment) Merge(other Comment) {
	e.Author = other.Author
	e.Likes = other.Likes
	e.IsNew = false
}
