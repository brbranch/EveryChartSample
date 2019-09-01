package oauth

import "project/core"

const AnonymousIdSession = "anonymousId"

/** リンクするアカウント */
type LinkedAccount struct {
	UniqueID    string // 他のIdPともかぶらないようにしたID
	Type        string // IdPのタイプ
	ID          string // IdPのID
	Name        string // Name
	ImageURL    string // ImageURL
	Description string // プロフィール
	Email       string // Email (空)
}

type AuthClient interface {
	GetAuthUrl(anonymousId string) (string, error)
	GetAccount(verifier string) (*LinkedAccount, error)
}

type AuthType string

const (
	Twitter AuthType = "twitter"
)

func NewAuthClient(authType AuthType, ctx core.Context) AuthClient {
	switch authType {
	case Twitter:
		return NewTwitterAuth(ctx)
	}
	return nil
}
