package account

import (
	"time"
	"fmt"
)

type Account struct {
	ID string
	CommentID string
	Avater
	UserName
	Description string
	AccountStatus
	Private bool
	LastLoggedIn time.Time
}

func NewAccount(id string) *Account {
	return &Account{
		ID: id,
		AccountStatus: AccountStatusAvailable,
		LastLoggedIn: time.Now(),
	}
}

func (a *Account) IsSame(target *Account) bool {
	if target == nil {
		return false
	}
	return target.ID == a.ID
}

func (a *Account) Duplicate() {
	a.AccountStatus = AccountStatusDuplicate
	a.ID = ""
}

func (a *Account) SignIn() {
	a.AccountStatus = AccountStatusSignIn
}

func (a *Account) SignUp() {
	a.AccountStatus = AccountStatusSignUp
}

func (a *Account) Delete() {
	a.AccountStatus = AccountStatusDeleted
}

func (a *Account) Available() {
	a.AccountStatus = AccountStatusAvailable
}

func (a Account) Title() string {
	return fmt.Sprintf("%sさんのページ", a.Name())
}

func (a Account) DescriptionString() string {
	return a.Description
}