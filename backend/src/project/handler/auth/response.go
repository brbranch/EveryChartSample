package auth

import (
	"project/model/account"
	"encoding/json"
	"project/mapper"
)

type LoginResponse struct {
	Error string
}

func asJsonString(account *account.Account) string {
	str , err := json.Marshal(mapper.AccountToJson(account))
	if err != nil {
		return "{}"
	}
	return string(str)
}
