package usecase

import (
	"project/core"
	"project/client/oauth"
	"project/model/account"
)

type LoginService struct {
	context core.Context
	link *oauth.LinkedAccount
}

const pendingLink = "linkAccountCache"

type LoginResult int

func NewLoginService(ctx core.Context) *LoginService {
	return &LoginService{ctx, nil}
}

func (s *LoginService) LoginOrSignup(account *oauth.LinkedAccount) ( *account.Account, error) {
	return nil, nil
}

func (s *LoginService) HasAccount(accountID string) (bool, error) {
	return false, nil
}

func (s *LoginService) SignupWithID(accountID string) ( *account.Account, error) {
	return nil, nil
}

