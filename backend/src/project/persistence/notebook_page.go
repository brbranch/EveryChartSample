package persistence

import (
		"project/client/foon"
	"project/persistence/repository"
	"project/persistence/data"
	"cloud.google.com/go/firestore"
	"time"
	"project/exception"
)

type NotebookPageRepository struct {
	f *foon.Foon
}

func NewNotebookPageRepository(f *foon.Foon) repository.INotebookPageRepository {
	return &NotebookPageRepository{f}
}

func (n *NotebookPageRepository) Create(data *data.NotebookPage) error {
	data.CreatedAt = time.Now()
	data.UpdatedAt = time.Now()
	return n.f.Insert(data)
}


func (n *NotebookPageRepository) Update(data *data.NotebookPage) error {
	data.UpdatedAt = time.Now()
	return n.f.Put(data)
}

func (n *NotebookPageRepository) GetAll(parent *data.Notebook) ([]*data.NotebookPage, error) {
	res := []*data.NotebookPage{}
	seed := data.NewNotebookPage(parent, "")
	cond := foon.NewConditions().Where("disabled", "==", false)
	cond = cond.OrderBy( "average", firestore.Desc)
	cond = cond.OrderBy("createdAt", firestore.Desc)

	if err := n.f.GetByQuery(foon.NewKey(seed), &res, cond); err != nil {
		return nil, err
	}

	return res, nil
}

func (n *NotebookPageRepository) GetByCursor(parent *data.Notebook, cursor string) ([]*data.NotebookPage, error) {
	res := []*data.NotebookPage{}
	seed := data.NewNotebookPage(parent, "")
	cond := foon.NewConditions().Where("disabled", "==", false)
	if cursor != "" {
		cur, err := foon.NewCursor(cursor)
		if err != nil {
			return nil, exception.INVALID_PARAM
		}
		cond = cond.StartAfter(cur)
	} else {
		cond = cond.OrderBy( "average", firestore.Desc)
		cond = cond.OrderBy("createdAt", firestore.Desc)
	}
	cond = cond.Limit(10)

	if err := n.f.GetByQuery(foon.NewKey(seed), &res, cond); err != nil {
		return nil, err
	}

	return res, nil
}

func (n *NotebookPageRepository) Get(parent *data.Notebook, pageId string) (*data.NotebookPage, error) {
	res := data.NewNotebookPage(parent, pageId)
	if err := n.f.Get(res); err != nil {
		return nil, err
	}
	return res, nil
}

func (n *NotebookPageRepository) GetRecent(cursor string) ([]*data.NotebookPage, error) {
	// FIXME: CollectionGroupはCursorきかない疑惑…とりあえず、その機能はなしにしておく
	res := []*data.NotebookPage{}
	cond := foon.NewConditions().Where("disabled", "==", false).Where("adult", "==", false).Where("private", "==", false)
	cond = cond.OrderBy("updatedAt", firestore.Desc)
	cond = cond.Limit(10)

	if err := n.f.GetGroupByQuery(&res, cond); err != nil {
		return nil, err
	}
	return res, nil
}
