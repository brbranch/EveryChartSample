package page

import (
	"project/client/storage"
	"project/model"
	"project/model/account"
	"project/model/notebook"
	"time"
	"fmt"
)

/** ノートのページ */
type Page struct {
	Notebook    *notebook.Notebook
	PageID      string
	Author      Author
	Title       string
	Description string
	Image       string
	Items       []Item
	Likes
	CanComment  bool
	CanEvaluate bool
	Disabled    bool
	Private     bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

func NewPage(notebook *notebook.Notebook) *Page {
	items := NewItemsByNotebook(notebook)
	page := &Page{
		Notebook:    notebook,
		Items:       items,
		Likes:       Likes{},
		Private:     notebook.Private,
		CanComment:  true,
		CanEvaluate: true,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	return page
}

func (n *Page) Merge(other *Page) {
	n.Title = other.Title
	n.Image = other.Image
	n.Description = other.Description
	n.CanComment = other.CanComment
	n.CanEvaluate = other.CanEvaluate
	n.Items = other.Items
	n.UpdatedAt = time.Now()
}

func NewPageWithItems(notebook *notebook.Notebook, items []Item) *Page {
	page := &Page{
		Notebook:    notebook,
		Items:       items,
		Likes:       Likes{},
		CanComment:  true,
		CanEvaluate: true,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	return page
}

func (p Page) CanPost(ac *account.Account) bool {
	return p.Notebook.CanPost(ac)
}

func (p *Page) ChangeItems(items []Item) {
	p.Items = items
}

func (p Page) HasID() bool {
	return p.PageID != ""
}

func (p *Page) AddComment(comment *Comment) {
}

func (p *Page) RemoveComment(comment *Comment) {
	comment.PostId = 0
}

func (p Page) HasImage() bool {
	return len(p.Image) > 0
}

func (p *Page) DeleteImage(gcs *storage.GoogleCloudStorage) error {
	return nil
}

func (p *Page) UploadImage(gcs *storage.GoogleCloudStorage, base64Image string) error {
	return nil
}

func (p Page) CommentCount() int {
	return 0
}

func (p Page) ChartCounts() int {
	return 0
}

func (p Page) ItemCount() int {
	return len(p.Items)
}

func (n *Page) SyncCoreData(entity model.IEntity) {
}

func (n *Page) HasEditPermission(ac *account.Account) bool {
	if n.Notebook == nil {
		return false
	}
	return n.IsAuthor(ac)
}

func (n *Page) IsPrivate() bool {
	return n.Private
}

func (n *Page) ChangePrivate(private bool) {
	n.Private = private
}

func (n *Page) IsAuthor(ac *account.Account) bool {
	return n.IsOwner(ac) || n.Author.IsSame(ac)
}

func (n *Page) IsOwner(ac *account.Account) bool {
	return n.Notebook.IsOwner(ac)
}

func (n Page) TitleString() string {
	return fmt.Sprintf("%sの口コミ評価です", n.Title)
}

func (n Page) DescriptionString() string {
	if n.CanEvaluate {
		return "詳細・口コミ投稿はこちら"
	}
	if n.CanComment {
		return "詳細・コメント投稿はこちら"
	}
	return "口コミの詳細はこちら"
}

func (n Page) CardImage() string {
	if n.HasImage() {
		return n.Image
	}
	return "ogp_chart.png"
}
