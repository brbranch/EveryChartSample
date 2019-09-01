package usecase

import (
	"project/model/page"
	"project/core"
)

type CommentService struct {
	ctx core.Context
}

func NewCommentService(ctx core.Context) *CommentService {
	return &CommentService{ctx}
}

func (s *CommentService) GetOrCreate(accountId string, notebookId string, pageId string, commentId string, commentOnly bool) (*page.Comment, error) {
	return nil, nil
}

func (s *CommentService) GetInstances(accountId string, notebookId string, pageId string, cursor string) ([]*page.Comment, string, error) {
	return []*page.Comment{}, "", nil
}

func (s *CommentService) UpdateComment(accountId string, notebookId string, pageId string, comment *page.Comment) (error) {
	return nil
}

func (s *CommentService) Delete(accountId string, notebookId string, pageId string, commentId string) error {
	return nil
}

func (s *CommentService) ToggleLike(accountId string, notebookId string, pageId string, commentId string, targetSessionId string) error {
	return nil
}

