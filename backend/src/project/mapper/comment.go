package mapper

import (
	"project/model/account"
	"project/model/page"
	"time"
)

type PageComment struct {
	CommentID string `json:"commentId"`
	AccountID string `json:"accountId"`
	Author    Author `json:"author"`
	PostId    int    `json:"postId"`
	Evaluates bool   `json:"evaluates"`
	Values    []int  `json:"values"`
	Likes     int    `json:"likes"`
	IsLike    bool   `json:"isLike"`
	Comment   string `json:"comment"`
	Disabled  bool   `json:"disabled"`
	CreatedAt int    `json:"created"`
	IsNew     bool   `json:"isNew"`
}

type Author struct {
	AuthorID string `json:"authorId"`
	Name     string `json:"name"`
	Image    string `json:"image"`
}

type commentMapper struct {
}

var CommentMapper commentMapper = commentMapper{}

func (n PageComment) ToModel() *page.Comment {
	return &page.Comment{
		ID:        page.PageCommentId(n.CommentID),
		PostId:    n.PostId,
		Author:    n.Author.ToModel(),
		Evaluates: n.Evaluates,
		Values:    n.intsToEvaluates(n.Values),
		Comment:   n.Comment,
		Disabled:  n.Disabled,
		IsNew:     n.IsNew,
		Created:   time.Unix(int64(n.CreatedAt/1000), 0),
	}
}

func (a Author) ToModel() page.Author {
	return page.NewAuthor(a.AuthorID, a.Image, a.Name)
}

func (n commentMapper) ToEntity(comment *page.Comment, currentSession *account.Account) *PageComment {
	return &PageComment{
		CommentID: comment.ID.String(),
		Author:    n.AuthorToJson(comment.GetAuthor()),
		PostId:    comment.PostId,
		Evaluates: comment.GetEvaluates(),
		Values:    comment.EvaluateValues(),
		Likes:     comment.LikeCount(),
		IsLike:    comment.IsLike(currentSession),
		Comment:   comment.CommentString(),
		Disabled:  comment.Disabled,
		IsNew:     comment.IsNew,
		CreatedAt: int(comment.Created.Unix() * 1000),
	}
}

func (n commentMapper) AuthorToJson(author page.Author) Author {
	return Author{
		AuthorID: author.AuthorID.String(),
		Image:    author.Image,
		Name:     author.Name,
	}
}

func (n commentMapper) ToEntities(comments []*page.Comment, session *account.Account) []*PageComment {
	res := []*PageComment{}
	for _, comment := range comments {
		res = append(res, n.ToEntity(comment, session))
	}
	return res
}
