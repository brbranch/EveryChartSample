package notebook

import (
	"project/model"
	"project/model/account"
	"time"
	"fmt"
)

/**
  評価を行うリスト
*/
type Notebook struct {
	Account        *account.Account
	ID             string
	Category       Category
	Title          string
	ImageURL       string
	Description    string
	EditPermission EditPermission
	Private		   bool
	Adult          bool
	Items          Items
	PageCount      int
	Disabled       bool
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

func NewNotebook(ac *account.Account, id string) *Notebook {
	return &Notebook{
		Account:   ac,
		ID:        id,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

func (n *Notebook) SyncCoreData(entity model.IEntity) {
}

func (n *Notebook) Update(request Notebook) {
	n.Category = request.Category
	n.Title = request.Title
	n.ImageURL = request.ImageURL
	n.Description = request.Description
	n.EditPermission = request.EditPermission
	n.Private = request.Private
	n.Adult = request.Adult
	n.Items = request.Items
	n.UpdatedAt = time.Now()
}

func (n Notebook) IsSame(id string) bool {
	if id == "" {
		return false
	}
	return id == n.ID
}

func (n Notebook) CanEdit(ac *account.Account) bool {
	return n.IsOwner(ac)
}

func (n Notebook) CanRead(ac *account.Account) bool {
	if n.Private {
		return n.IsOwner(ac)
	}
	return true
}

func (n Notebook) IsOwner(ac *account.Account) bool {
	if ac == nil {
		return false
	}
	return ac.IsSame(n.Account)
}

func (n Notebook) CanPost(ac *account.Account) bool {
	if ac == nil {
		return false
	}

	if n.Private || n.EditPermission.IsSelfOnly() {
		return n.IsOwner(ac)
	}

	return true
}

func (n Notebook) TitleString() string {
	return fmt.Sprintf("%sのランキング", n.Title)
}

func (n Notebook) DescriptionString() string {
	if len(n.Description) > 0 {
		if len(n.Description) > 100 {
			return fmt.Sprintf("%s...", n.Description[:98])
		}
		return n.Description
	}
	return "詳細・投稿はこちら"
}

func (n Notebook) CardImage() string {
	if len(n.ImageURL) > 0 {
		return n.ImageURL
	}
	return "ogp_note.png"
}