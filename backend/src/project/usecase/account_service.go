package usecase

import (
	"project/core"
	"project/model/account"
	"project/client/session"
	"project/persistence"
	"project/client/foon"
	)

type AccountService struct {
	Context core.Context
}

func NewAccountService(c core.Context) *AccountService {
	return &AccountService{c}
}

func (s *AccountService) GetAccountById(accountID string) (*account.Account, error) {
	fn := foon.Must(s.Context)
	sess := session.MustSession(s.Context)
	current := sess.GetAccount()

	if current != nil && current.IsSame(account.NewAccount(accountID)) {
		return current, nil
	}

	acRep := persistence.NewAccountRepository(fn)
	if newAccount , err := acRep.GetByID(accountID); err != nil {
		s.Context.Warningf("failed to get Account (reason: %v)", err)
		return nil, err
	} else {
		model := newAccount.ToModel()
		// TODO: アカウントの状態を確認
		return model, nil
	}
}

func (s *AccountService) DisableAll() error {
	// TODO: すべてを除外する
	return nil
}

