package data

import (
	"github.com/pkg/errors"
	"project/client/foon"
	"project/model/account"
	"project/model/notebook"
	"time"
	)

type Notebook struct {
	Entity
	__kind      string         `foon:"collection,Notebook"`
	Parent      *foon.Key      `foon:"parent"`
	AccountID   string		   `firestore:"accountId"`
	Title       string         `firestore:"title"`
	Category    string         `firestore:"category"`
	Description string         `firestore:"description"`
	Adult       bool           `firestore:"adult"`
	ImageURL    string         `firestore:"image"`
	Items       []string       `firestore:"items"`
	PageCount   int			   `firestore:"pageCount"`
	PageOrder   int64		   `firestore:"pageOrder"`
	Disabled    bool		   `firestore:"disabled"`
	Editable    string         `firestore:"editable"`
	Private		bool		   `firestore:"private"`
}

var NotebookMapper notebookMapper = notebookMapper{}

type notebookMapper struct {
}

func NewNotebookById(accountId string, id string) *Notebook {
	return &Notebook{
		Entity: NewEntity(id),
		AccountID: accountId,
		Parent: foon.NewKey(NewAccount(accountId)),
	}
}

func NewNotebook(account *Account, id string) *Notebook {
	return &Notebook{
		Entity: NewEntity(id),
		AccountID: account.ID,
		Parent: foon.NewKey(account),
	}
}

func (book Notebook) AsModelWithAccount(account *account.Account) *notebook.Notebook {
	return &notebook.Notebook{
		account,
		book.ID,
		notebook.Category(book.Category),
		book.Title,
		book.ImageURL,
		book.Description,
		notebook.EditPermission(book.Editable),
		book.Private,
		book.Adult,
		notebook.NewItems(book.Items),
		book.PageCount,
		book.Disabled,
		book.CreatedAt,
		book.UpdatedAt,
	}
}

func (book *Notebook) Update(id string, create time.Time, update time.Time) {
	book.ID = id
	book.CreatedAt = create
	book.UpdatedAt = time.Now()
}

func (b *Notebook) UpdatePageOrder() {
	b.PageOrder = b.UpdatedAt.Unix() + int64(b.PageCount * 300)
}

func (notebookMapper) ToEntity(book *notebook.Notebook) *Notebook {
	res := &Notebook{}
	res.ID = book.ID
	res.AccountID = book.Account.ID
	res.Parent = foon.NewKey(NewAccount(book.Account.ID))
	res.Title = book.Title
	res.Category = book.Category.String()
	res.Description = book.Description
	res.Adult = book.Adult
	res.ImageURL = book.ImageURL
	res.PageCount = book.PageCount
	res.Items = book.Items.StringList()
	res.Editable = book.EditPermission.String()
	res.Private = book.Private
	res.Disabled = book.Disabled
	res.CreatedAt = book.CreatedAt

	if res.CreatedAt.IsZero() {
		res.CreatedAt = time.Now()
	}
	res.UpdatedAt = time.Now()
	res.UpdatePageOrder()
	return res
}


func (notebookMapper) ToCollection(accounts []*account.Account, books []*Notebook) ([]*notebook.Notebook, error) {
	maps := map[string]*account.Account{}
	for i, account := range accounts {
		maps[account.ID] = accounts[i]
	}
	resp := []*notebook.Notebook{}

	for _, book := range books {
		if ac, ok := maps[book.Parent.ID]; ok {
			resp = append(resp, book.AsModelWithAccount(ac))
		} else {
			return nil, errors.New("failed to get account")
		}
	}

	return resp, nil
}
