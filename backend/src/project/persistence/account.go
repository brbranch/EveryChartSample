package persistence

import (
		"project/persistence/repository"
	"project/persistence/data"
	"project/client/foon"
)

type AccountRepository struct {
	f *foon.Foon
	cache map[string]*data.Account
}

func NewAccountRepository(fn *foon.Foon) repository.IAccountRepository {
	return &AccountRepository{fn, map[string]*data.Account{}}
}

func (r *AccountRepository) Save(account *data.Account) error {
	return r.f.Put(account)
}

func (r *AccountRepository) GetByKey(key *foon.Key) (*data.Account, error) {
	if a , ok := r.cache[key.Path()]; ok {
		return a, nil
	}
	ac := &data.Account{}
	if err := r.f.GetByKey(key, ac); err != nil {
		return nil, err
	}
	r.cache[key.Path()] = ac
	return ac, nil
}

func (r *AccountRepository) GetByID(accountID string) (*data.Account, error) {
	return r.GetByKey(foon.NewKey(data.NewAccount(accountID)))
}

func (r *AccountRepository) Register(account *data.Account) (error) {
	batch ,err := r.f.Batch()
	if err != nil {
		return err
	}
	batch.Create(account)
	return batch.Commit()
}

