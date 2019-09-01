package usecase

import (
	"project/core"
	"project/client/session"
	"project/model/notebook"
	"project/persistence"
	"project/model/account"
	"project/exception"
	"project/persistence/data"
	"project/client/foon"
	)

type NotebookService struct {
	core.Context
}

func NewNotebookService(c core.Context) *NotebookService {
	return &NotebookService{c}
}

func (s *NotebookService) CreateNotebook(notebook *notebook.Notebook) error {
	return nil
}

func (s *NotebookService) GetNotebook(accountId string, id string) (*notebook.Notebook, error) {
	if accountId == "" || id == "" {
		return nil, s.WrapErrorf(exception.INVALID_PARAM, "id or account is invalid")
	}
	return nil, exception.NO_SUCH_ENTITY
}

func (s *NotebookService) GetRecentNotebooks(cursor string) ([]*notebook.Notebook, string, error) {
	fn := foon.Must(s.Context)
	repo := persistence.NewNotebookRepository(fn)
	pages, err := repo.GetRecentBook(cursor)
	if err != nil {
		s.Context.Warningf("failed to get pages (reason: %v)", err)
		return nil, "", err
	}
	res := []*notebook.Notebook{}
	acRepo := persistence.NewAccountRepository(fn)

	for _, p := range pages {
		ac , err := acRepo.GetByID(p.AccountID)
		if err != nil {
			s.Context.Warningf("failed to get account (reason: %v)", err)
			continue
		}

		res = append(res, p.AsModelWithAccount(ac.ToModel()))
	}

	return res, fn.LastCursor(), nil
}

func (s *NotebookService) GetNotebooks(accountId string, cursor string) ([]*notebook.Notebook, string, error) {
	if accountId == "" {
		return nil, "", s.WrapErrorf(exception.INVALID_PARAM, "id or account is invalid")
	}

	acService := NewAccountService(s.Context)
	ac, err := acService.GetAccountById(accountId)
	if err != nil {
		return nil, "", s.Context.WrapErrorf(err, "failed to get account")
	}

	fn := foon.Must(s)
	rep := persistence.NewNotebookRepository(fn)

	all := !ac.IsSame(session.MustSession(s.Context).GetAccount())

	books , err := rep.GetAllById(ac.ID, cursor, all)
	if err != nil {
		return nil, "", s.WrapErrorf(err, "failed to get collection.")
	}

	col, err := data.NotebookMapper.ToCollection([]*account.Account{ ac }, books)
	if err != nil {
		return nil, "", err
	}

	return col , fn.LastCursor(), nil
}

func (s *NotebookService) UpdateNotebook(account *account.Account, update *notebook.Notebook) error {
	return nil
}

func (s *NotebookService) DeleteNotebook(accountId string, id string) error {
	return nil
}

