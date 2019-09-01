package data

import (
	"project/client/oauth"
	"project/model/account"
	"time"
)

type Account struct {
	__kind string `foon:"collection,UserAccount"`
	Entity
	Name         string          `firestore:"name"`
	Description  string          `firestore:"description"`
	Status       string          `firestore:"status"`
	Icon         string          `firestore:"icon"`
	LastLoggedIn time.Time       `firestore:"lastLoggedIn"`
}

type Link struct {
	IdpID string `firestore:"idpId"`
	Type  string `firestore:"type"`
}

var AccountMapper accountMapper = accountMapper{}

type accountMapper struct {
}

func (accountMapper) ToEntity(ac *account.Account) *Account {
	newAc := NewAccount(ac.ID)
	newAc.Name = ac.Name()
	newAc.Description = ac.Description
	newAc.Status = string(ac.AccountStatus)
	newAc.Icon = ac.Image()
	newAc.LastLoggedIn = ac.LastLoggedIn
	return newAc
}

func NewAccountWithIdpLink(ac *oauth.LinkedAccount, commentId string) *Account {
	newAc := NewAccount(ac.ID)
	newAc.Name = ac.Name
	newAc.Description = ac.Description
	newAc.Status = string(account.AccountStatusAvailable)
	newAc.Icon = ac.ImageURL
	newAc.LastLoggedIn = time.Now()
	return newAc
}

func (a Account) ToModel() *account.Account {
	return &account.Account{
		ID:            a.ID,
		Avater:        account.NewAvater(a.Icon),
		UserName:      account.NewUserName(a.Name),
		Description:   a.Description,
		AccountStatus: account.AccountStatus(a.Status),
		LastLoggedIn:  a.LastLoggedIn,
	}
}

func (a *Account) Update(ac account.Account) {
	a.Name = ac.Name()
	a.Description = ac.Description
	a.Icon = ac.Image()
	a.Status = string(ac.AccountStatus)
	a.LastLoggedIn = ac.LastLoggedIn
}


func NewAccount(id string) *Account {
	return &Account{
		Entity: NewEntity(id),
	}
}
