package repository

import (
	"project/persistence/data"
	"project/client/foon"
)

type ICommentRepository interface {
	Get(page *data.NotebookPage, id string) (*data.Comment, error)
	GetByCursor(page *data.NotebookPage, cursor *foon.Cursor, limit int) ([]*data.Comment, error)
	Put(comment *data.Comment) error
	Delete(comment *data.Comment) error
}

