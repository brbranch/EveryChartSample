package mapper

import (
	"project/model/account"
	"project/model/page"
	"time"
)

type NotebookPage struct {
	Notebook      *Notebook          `json:"notebook"`
	PageID        string             `json:"id"`
	Author        Author             `json:"author"`
	Title         string             `json:"title"`
	Description   string             `json:"description"`
	Image         string             `json:"image"`
	Items         []NotebookPageItem `json:"items"`
	Likes         int                `json:"likes"`
	IsLike        bool               `json:"isLike"`
	CommentCounts int                `json:"commentCounts"`
	ChartCounts   int                `json:"chartCounts"`
	CanComment    bool               `json:"comment"`
	CanEvaluate   bool               `json:"evaluate"`
	Posts         int                `json:"posts"`
	Private       bool               `json:"private"`
	Average       float64            `json:"average"`
	CreatedAt     int                `json:"createdAt"`
	UpdatedAt     int                `json:"updatedAt"`
}

type NotebookPageItem struct {
	Name  string `json:"name"`
	Value int    `json:"value"`
}

type NotebookPageMapper struct {
}

// NOTE: LikeCountsなど、一部できてない
func (n *NotebookPage) ToModel() *page.Page {
	notebook := n.Notebook.ToModel()
	items := []page.Item{}
	for _, item := range n.Items {
		items = append(items, item.ToModel())
	}
	p := page.NewPageWithItems(notebook, items)
	p.Author = n.Author.ToModel()
	p.Image = n.Image
	p.PageID = n.PageID
	p.Title = n.Title
	p.Description = n.Description
	p.Private = n.Private
	p.CanComment = n.CanComment
	p.CanEvaluate = n.CanEvaluate
	p.CreatedAt = time.Unix(int64(n.CreatedAt/1000), 0)
	p.UpdatedAt = time.Unix(int64(n.UpdatedAt/1000), 0)

	return p
}

func (n NotebookPageItem) ToModel() page.Item {
	return page.Item{n.Name, page.Evaluate(n.Value)}
}

func (n NotebookPageMapper) ToJson(page *page.Page, ac *account.Account) NotebookPage {
	res := NotebookPage{
		Notebook:      NotebookToJSON(page.Notebook),
		Author:        CommentMapper.AuthorToJson(page.Author),
		PageID:        page.PageID,
		Title:         page.Title,
		Description:   page.Description,
		Image:         page.Image,
		Items:         n.itemsToJson(page.Items),
		Likes:         page.LikeCount(),
		IsLike:        page.IsLike(ac),
		CommentCounts: page.CommentCount(),
		ChartCounts:   page.ChartCounts(),
		CanComment:    page.CanComment,
		CanEvaluate:   page.CanEvaluate,
		Private:       page.Private,
		CreatedAt:     int(page.CreatedAt.Unix() * 1000),
		UpdatedAt:     int(page.UpdatedAt.Unix() * 1000),
	}
	return res
}

func (n NotebookPageMapper) ToJsonInstances(pages []*page.Page, session *account.Account) []NotebookPage {
	res := []NotebookPage{}
	for _, page := range pages {
		if page.Disabled == false {
			res = append(res, n.ToJson(page, session))
		}
	}
	return res
}

func (n NotebookPageMapper) itemsToJson(items []page.Item) []NotebookPageItem {
	res := []NotebookPageItem{}
	for _, item := range items {
		res = append(res, n.itemToJson(item))
	}
	return res
}

func (n NotebookPageMapper) itemToJson(item page.Item) NotebookPageItem {
	return NotebookPageItem{
		Name:  item.Name,
		Value: item.Value.Value(),
	}
}

func (n PageComment) intsToEvaluates(nums []int) []page.Evaluate {
	res := []page.Evaluate{}
	for _, num := range nums {
		res = append(res, page.Evaluate(num))
	}
	return res
}

