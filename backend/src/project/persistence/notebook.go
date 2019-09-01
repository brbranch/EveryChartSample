package persistence

import (
	"cloud.google.com/go/firestore"
	"fmt"
			"project/client/foon"
	"project/persistence/data"
	"project/persistence/repository"
	"project/exception"
)

type NotebookRepository struct {
	f *foon.Foon
	cache map[string]*data.Notebook
}

func NewNotebookRepository(f *foon.Foon) repository.INotebookRepository {
	return &NotebookRepository{f, map[string]*data.Notebook{}}
}

func notebookCollectionCachePath(path string) string {
	return fmt.Sprintf("collectionCache/Notebook/%s", path)
}

func (r *NotebookRepository) Save(notebook *data.Notebook) error {

	if err := r.f.Put(notebook); err != nil {
		return err
	}

	return nil
}

func (r *NotebookRepository) GetByParent(key *foon.Key) (*data.Notebook, error) {
	if n, ok := r.cache[key.Path()]; ok {
		return n, nil
	}

	notebook := &data.Notebook{}

	if err := r.f.GetByKey(key, notebook); err != nil {
		return nil, err
	}

	r.cache[key.Path()] = notebook
	return notebook, nil
}

func (r *NotebookRepository) GetByID(accountID string, id string) (*data.Notebook, error) {
	account := data.NewAccount(accountID)
	notebook := data.NewNotebook(account, id)
	return r.GetByParent(foon.NewKey(notebook))
}

func (r *NotebookRepository) GetAllById(accountID string, cursor string, publicOnly bool) ([]*data.Notebook, error) {
	account := data.NewAccount(accountID)
	notebook := data.NewNotebook(account, "")
	cond := foon.NewConditions().Where("disabled", "==", false)
	if publicOnly {
		cond = cond.Where("private" , "==", false)
	}
	if cursor != "" {
		cur , err := foon.NewCursor(cursor)
		if err != nil {
			return nil, exception.INVALID_PARAM
		}
		cond = cond.StartAfter(cur)
	} else {
		cond = cond.OrderBy("updatedAt", firestore.Desc)
	}
	cond = cond.Limit(10)

	books := []*data.Notebook{}

	if err := r.f.GetByQuery(foon.NewKey(notebook), &books, cond); err != nil {
		return nil, err
	}

	return books, nil
}

func (r *NotebookRepository) GetRecentBook(cursor string) ([]*data.Notebook, error) {
	// FIXME: GroupがCursorきかない。。。。。。

	res := []*data.Notebook{}
	cond := foon.NewConditions().Where("disabled", "==", false)
	cond = cond.Where("adult", "==", false)
	cond = cond.Where("private", "==", false)
	cond = cond.OrderBy("pageOrder", firestore.Desc)
	cond = cond.Limit(10)
	if err := r.f.GetGroupByQuery(&res, cond); err != nil {
		return nil, err
	}
	return res, nil
}
