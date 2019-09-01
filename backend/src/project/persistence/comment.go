package persistence

import (
	"cloud.google.com/go/firestore"
	"google.golang.org/appengine/log"
	"project/client/foon"
	"project/persistence/data"
	"project/persistence/repository"
)

type CommentRepository struct {
	f *foon.Foon
}

func NewCommentRepository(f *foon.Foon) repository.ICommentRepository {
	return &CommentRepository{f}
}

func (r *CommentRepository) Get(page *data.NotebookPage, id string) (*data.Comment, error) {
	res := data.NewComment(page, id)
	if err := r.f.Get(res); err != nil {
		return nil, err
	}
	return res, nil
}

func (r *CommentRepository) Put(comment *data.Comment) error {
	return r.f.Put(comment)
}

func (r *CommentRepository) GetByCursor(page *data.NotebookPage, cursor *foon.Cursor, limit int) ([]*data.Comment, error) {
	condition := foon.NewConditions().Where("disabled", "==", false)
	if cursor != nil {
		condition.StartAfter(cursor)
	} else {
		condition.OrderBy("likeCount", firestore.Desc).OrderBy("createdAt", firestore.Desc).OrderBy("id", firestore.Desc)
	}
	condition.Limit(limit)

	res := []*data.Comment{}
	key := foon.NewKey(data.NewComment(page, ""))

	log.Infof(r.f.Context, "key: %s", key.Path())

	if err := r.f.GetByQuery(key, &res, condition); err != nil {
		return nil, err
	}
	return res, nil
}

func (r *CommentRepository) Delete(comment *data.Comment) error {
	return r.f.Delete(comment)
}
