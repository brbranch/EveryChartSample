package usecase

import (
	"project/core"
	"project/client/foon"
		"project/model/notebook"
	"project/model/page"
	"project/persistence"
	"project/persistence/data"
	"project/model/account"
)

type NotebookPageService struct {
	Context core.Context
}

func NewNotebookPageService(ctx core.Context) *NotebookPageService {
	return &NotebookPageService{Context: ctx}
}

func (s *NotebookPageService) completePage(model *page.Page, ac *account.Account) *page.Page {
	model.Author = page.NewAuthorWithAcount(ac)
	return model
}

func (s *NotebookPageService) NewPage(accountId string, notebookId string) (*page.Page, error) {
	return nil, nil
}

func (s *NotebookPageService) EditPage(accountId string, notebookId string, pageId string) (*page.Page, error) {
	return nil, nil
}

func (s *NotebookPageService) Get(accountId string, notebookId string, pageId string) (*page.Page, error) {
	notebookService := NewNotebookService(s.Context)
	notes, err := notebookService.GetNotebook(accountId, notebookId)

	if err != nil {
		return nil, s.Context.WrapErrorf(err, "failed to get notebooks.")
	}

	// TODO: アカウントの状態チェック

	fn := foon.Must(s.Context)
	repo := persistence.NewNotebookPageRepository(fn)

	res, err := repo.Get(data.NotebookMapper.ToEntity(notes), pageId)
	if err != nil {
		return nil, s.Context.WrapErrorf(err , "failed to get page.")
	}

	// TODO: ノートの状態チェック

	return s.toEntity(notes, res), nil
}

func (s *NotebookPageService) GetAllPages(accountId string, notebookId string, cursor string) ([]*page.Page, string , error) {
	notebookService := NewNotebookService(s.Context)

	notes, err := notebookService.GetNotebook(accountId, notebookId)

	if err != nil {
		return nil, "", s.Context.WrapErrorf(err, "failed to get notebooks.")
	}

	fn := foon.Must(s.Context)
	repo := persistence.NewNotebookPageRepository(fn)

	res, err := repo.GetByCursor(data.NotebookMapper.ToEntity(notes), cursor)
	if err != nil {
		return nil , "", s.Context.WrapErrorf(err , "failed to get notebook pages")
	}

	return s.completion(notes, res), fn.LastCursor(), nil
}

func (s *NotebookPageService) GetRecentPages(cursor string) ([]*page.Page, string, error) {
	fn := foon.Must(s.Context)
	pageRepo := persistence.NewNotebookPageRepository(fn)
	pages, err := pageRepo.GetRecent(cursor)
	if err != nil {
		s.Context.Warningf("failed to get pages (reason: %v)", err)
		return nil, "", err
	}
	res := []*page.Page{}
	acRepo := persistence.NewAccountRepository(fn)
	noteRepo := persistence.NewNotebookRepository(fn)

	for _, p := range pages {
		n , err := noteRepo.GetByParent(p.Parent)
		if err != nil {
			s.Context.Warningf("failed to get Notebook (reason: %v)", err)
			continue
		}

		ac , err := acRepo.GetByKey(n.Parent)
		if err != nil {
			s.Context.Warningf("failed to get account (reason: %v)", err)
			continue
		}
		res = append(res, p.ToModel(ac, n))
	}

	return res, fn.LastCursor(), nil
}

func (s *NotebookPageService) toEntity(book *notebook.Notebook, page *data.NotebookPage) *page.Page {
	ac := data.AccountMapper.ToEntity(book.Account)
	note := data.NotebookMapper.ToEntity(book)
	return page.ToModel(ac, note)
}

func (s *NotebookPageService) completion(books *notebook.Notebook, datas []*data.NotebookPage) ([]*page.Page) {
	ac := data.AccountMapper.ToEntity(books.Account)
	note := data.NotebookMapper.ToEntity(books)
	res := []*page.Page{}
	for _ ,data := range datas {
		res = append(res, data.ToModel(ac, note))
	}
	return res
}

func (s *NotebookPageService) Create(model *page.Page, base64Image string) (*page.Page, error) {
	return nil, nil
}

func (s *NotebookPageService) Update(model *page.Page, base64Image string) (*page.Page, error) {
	return nil, nil
}

func (s *NotebookPageService) ToggleLike(accountId string, notebookId string, pageId string, targetSessionId string) (int, error) {
	return 0, nil
}

func (s *NotebookPageService) DeletePage(accountId string, notebookId string, pageId string) error {
	return nil
}
