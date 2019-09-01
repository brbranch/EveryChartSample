package repository

import (
			"project/persistence/data"
	"project/client/foon"
)

type INotebookRepository interface {
	Save(notebook *data.Notebook) error
	GetByID(accountId string, id string) (*data.Notebook, error)
	GetByParent(key *foon.Key) (*data.Notebook, error)
	GetAllById(accountId string, cursor string, publicOnly bool) ([]*data.Notebook, error)
	GetRecentBook(cursor string) ([]*data.Notebook, error)
}
