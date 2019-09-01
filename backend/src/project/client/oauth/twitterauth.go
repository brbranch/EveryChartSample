package oauth

import (
	"encoding/json"
	"fmt"
	"github.com/garyburd/go-oauth/oauth"
	"github.com/pkg/errors"
	"google.golang.org/appengine/urlfetch"
	"net/url"
	"project/core"
	"project/exception"
	"project/client/session"
	"os"
)

const (
	twitterRequestToken  = "request_token"
	twitterRequestSecret = "request_secret"
	twitterOAuthToken    = "oauth_token"
	twitterOAuthSecret   = "oauth_secret"
)

type TwitterAuth struct {
	Context core.Context
}

type TwitterAccount struct {
	ID              string `json:"id_str"`
	Name            string `json:"name"`
	RefID           string `json:"screen_name"`
	Description     string `json:"description"`
	ProfileImageURL string `json:"profile_image_url_https"`
	Email           string `json:"email"`
}

func NewTwitterAuth(ctx core.Context) *TwitterAuth {
	return &TwitterAuth{Context: ctx}
}

func (t *TwitterAuth) Connect() *oauth.Client {
	return &oauth.Client{
		TemporaryCredentialRequestURI: "https://api.twitter.com/oauth/request_token",
		ResourceOwnerAuthorizationURI: "https://api.twitter.com/oauth/authenticate",
		TokenRequestURI:               "https://api.twitter.com/oauth/access_token",
		Credentials: oauth.Credentials{
			Token:  os.Getenv("TWITTER_AUTH_TOKEN"),
			Secret: os.Getenv("TWITTER_AUTH_SECRET"),
		},
	}
}

func (t *TwitterAuth) GetAuthUrl(anonymousId string) (string, error) {
	config := t.Connect()
	client := urlfetch.Client(t.Context)
	host := t.Context.Request().URL.Host
	schema := "https"
	url := fmt.Sprintf("%s://%s/callbacks/twitter", schema, host)
	if os.Getenv("ENVIRONMENT") == "local" {
		schema = "http"
		url = "http://127.0.0.1:8080/authc/twitter"
	}
	rt, err := config.RequestTemporaryCredentials(client, url, nil)
	if err != nil {
		return "", t.Context.WrapErrorf(err, "failed to create request.")
	}
	sess, err := session.NewSession(t.Context)
	if err != nil {
		return "", t.Context.WrapErrorf(err, "failed to open session.")
	}

	sess.PutString(AnonymousIdSession, anonymousId)
	sess.PutString(twitterRequestToken, rt.Token)
	sess.PutString(twitterRequestSecret, rt.Secret)

	sess.Save()

	return config.AuthorizationURL(rt, nil), nil
}

func (t *TwitterAuth) GetAccount(verifier string) (*LinkedAccount, error) {
	token, err := t.GetAccessToken(verifier)
	if err != nil {
		return nil, err
	}
	oc := t.Connect()
	client := urlfetch.Client(t.Context)
	v := url.Values{}
	v.Set("include_email", "true")
	resp, err := oc.Get(client, token, "https://api.twitter.com/1.1/account/verify_credentials.json", v)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 500 {
		return nil, errors.New("Twitter is unavailable")
	}

	if resp.StatusCode >= 400 {
		return nil, errors.New("Twitter request is invalid")
	}

	twitter := &TwitterAccount{}
	err = json.NewDecoder(resp.Body).Decode(twitter)

	if err != nil {
		return nil, t.Context.WrapErrorf(err, "failed to decode account")
	}

	return &LinkedAccount{
		UniqueID:    fmt.Sprintf("twitter:%s", twitter.ID),
		Type:        "twitter",
		ID:          twitter.RefID,
		Name:        twitter.Name,
		ImageURL:    twitter.ProfileImageURL,
		Description: twitter.Description,
		Email:       twitter.Email,
	}, nil

}

func (t *TwitterAuth) GetAccessToken(verifier string) (*oauth.Credentials, error) {
	config := t.Connect()
	sess, err := session.NewSession(t.Context)
	if err != nil {
		return nil, t.Context.WrapErrorf(err, "failed to open session.")
	}

	token := sess.GetString(twitterRequestToken)
	secret := sess.GetString(twitterRequestSecret)

	if token == "" || secret == "" {
		return nil, exception.INVALID_SESSION
	}

	client := urlfetch.Client(t.Context)
	at, _, err := config.RequestToken(client, &oauth.Credentials{
		Token:  token,
		Secret: secret,
	}, verifier)

	defer func() {
		sess.Delete(twitterRequestSecret)
		sess.Delete(twitterRequestToken)
		sess.Save()
	}()


	if err != nil {
		return nil, t.Context.WrapErrorf(err, "failed to request token.")
	}

	sess.PutString(twitterOAuthSecret, at.Secret)
	sess.PutString(twitterOAuthToken, at.Token)
	return at, nil
}
