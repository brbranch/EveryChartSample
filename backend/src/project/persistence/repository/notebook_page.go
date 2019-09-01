package repository

import "project/persistence/data"

type INotebookPageRepository interface {
	Create(data *data.NotebookPage) error
	Update(data *data.NotebookPage) error
	GetAll(parent *data.Notebook) ([]*data.NotebookPage, error)
	GetByCursor(parent *data.Notebook, cursor string) ([]*data.NotebookPage, error)
	GetRecent(cursor string) ([]*data.NotebookPage, error)
	Get(parent *data.Notebook, pageId string) (*data.NotebookPage, error)
}
