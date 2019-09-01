package repository

import (
	"project/persistence/data"
	"project/client/foon"
)

type IAccountRepository interface {
	Save(account *data.Account) error
	GetByID(accountID string) (*data.Account, error)
	GetByKey(key *foon.Key) (*data.Account, error)
	Register(account *data.Account) (error)
}
