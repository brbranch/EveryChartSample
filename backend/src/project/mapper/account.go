package mapper

import (
	"encoding/json"
	"project/model/account"
)

type Account struct {
	ID           string       `json:"id"`
	CommentID    string       `json:"commentId"`
	UserName     string       `json:"name"`
	Avater       string       `json:"image"`
	Description  string       `json:"description"`
	Status       string       `json:"status"`
	LastLoggedIn int          `json:"lastLoggedIn"`
}

type AccountTypes map[string]Type

type Type struct {
	Account string `json:"account"`
	Type    string `json:"type"`
}

func (m *Account) ToModel() *account.Account {
	model := account.NewAccount(m.ID)
	return model
}

func AccountToJson(ac *account.Account) *Account {
	return &Account{
		ID:           ac.ID,
		UserName:     ac.Name(),
		CommentID:    ac.CommentID,
		Avater:       ac.Image(),
		Description:  ac.Description,
		Status:       string(ac.AccountStatus),
		LastLoggedIn: int(ac.LastLoggedIn.Unix() * 1000),
	}
}

func (a Account) String() string {
	if str, err := json.Marshal(&a); err != nil {
		return err.Error()
	} else {
		return string(str)
	}
}
