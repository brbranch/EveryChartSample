package accounts

import (
	"project/model/account"
	"encoding/json"
	"project/mapper"
)

func asJsonString(account *account.Account) string {
	str , err := json.Marshal(mapper.AccountToJson(account))
	if err != nil {
		return "{}"
	}
	return string(str)
}
