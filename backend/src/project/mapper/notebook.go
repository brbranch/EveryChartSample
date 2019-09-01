package mapper

import (
	"project/model/account"
	"project/model/notebook"
	"time"
)

type Notebook struct {
	ID          string   `json:"id"`
	Account     User     `json:"account"`
	Title       string   `json:"title"`
	Category    string   `json:"category"`
	Description string   `json:"description"`
	Adult       bool     `json:"adult"`
	Image       string   `json:"image"`
	ImageURL    string   `json:"imageUrl"`
	Items       []string `json:"items"`
	PageCount   int      `json:"pages"`
	Editable    string   `json:"editable"`
	Private     bool     `json:"private"`
	CreatedAt   int      `json:"createdAt"`
}

type User struct {
	AccountID string `json:"id"`
	Name      string `json:"name"`
	Image     string `json:"image"`
}

func (u User) ToModel() *account.Account {
	ac := account.NewAccount(u.AccountID)
	ac.UserName = account.NewUserName(u.Name)
	ac.Avater = account.NewAvater(u.Image)
	return ac
}

func (n *Notebook) ToModel() *notebook.Notebook {
	return NewNotebookFromJSON(n, n.Account.ToModel())
}

func NotebooksToJSON(notes []*notebook.Notebook) []*Notebook {
	res := []*Notebook{}
	for _, note := range notes {
		if note.Disabled == false {
			res = append(res, NotebookToJSON(note))
		}
	}
	return res
}

func NotebookToJSON(note *notebook.Notebook) *Notebook {
	return &Notebook{
		ID: note.ID,
		Account: User{
			AccountID: note.Account.ID,
			Name:      note.Account.Name(),
			Image:     note.Account.Image(),
		},
		Category:    note.Category.String(),
		Title:       note.Title,
		Description: note.Description,
		Adult:       note.Adult,
		ImageURL:    note.ImageURL,
		Items:       note.Items.StringList(),
		PageCount:   note.PageCount,
		Editable:    note.EditPermission.String(),
		Private:     note.Private,
		CreatedAt:   int(note.CreatedAt.Unix() * 1000),
	}
}

func NewNotebookFromJSON(json *Notebook, account *account.Account) *notebook.Notebook {
	return &notebook.Notebook{
		Account:        account,
		ID:             json.ID,
		Title:          json.Title,
		ImageURL:       json.ImageURL,
		Description:    json.Description,
		Category:       notebook.Category(json.Category),
		Adult:          json.Adult,
		PageCount:      json.PageCount,
		Items:          notebook.NewItems(json.Items),
		EditPermission: notebook.EditPermission(json.Editable),
		Private:        json.Private,
		CreatedAt:      time.Unix(int64(json.CreatedAt/1000), 0),
		UpdatedAt:      time.Now(),
	}
}
