package index

import (
	"project/mapper"
	"project/model/account"
	"encoding/json"
)

type IndexResponse struct {
	Account mapper.Account `json:"account"`
}

func asJsonString(account *account.Account) string {
	str , err := json.Marshal(mapper.AccountToJson(account))
	if err != nil {
		return "{}"
	}
	return string(str)
}
