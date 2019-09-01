package session

import (
	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"project/model/account"
	"project/core"
	"project/exception"
)

type Session struct {
	c core.Context
	sess *sessions.Session
}

func NewSession(ctx core.Context) (*Session, error) {
	sess, err := session.Get("session", ctx.Echo())
	if err != nil {
		ctx.Errorf("failed to get session reason: %v", err)
		return nil, err
	}
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400,
		HttpOnly: true,
	}
	return &Session{ ctx, sess }, nil
}

func MustSession(ect core.Context) *Session {
	ses , err := NewSession(ect)
	if err != nil {
		panic(err)
	}
	return ses
}

func (s *Session) PutString(key string, name string) {
	s.sess.Values[key] = name
}

func (s *Session) PutAndSave(key string, name string) {
	s.sess.Values[key] = name
	s.Save()
}

func (s *Session) GetString(key string) string {
	if val, found := s.sess.Values[key]; found {
		if res , ok := val.(string); ok {
			return res
		}
	}
	return ""
}

func (s *Session) Delete(key string) error {
	if _ , ok := s.sess.Values[key]; ok {
		delete(s.sess.Values, key)
	}
	return nil
}

func (s *Session) DeleteAll() error {
	s.sess.Values = map[interface{}]interface{}{}
	return s.Save()
}

func (s *Session) Save() error {
	return s.sess.Save(s.c.Echo().Request(), s.c.Echo().Response())
}

func (s *Session) PutFlush(value string) {
	s.PutAndSave("flush", value)
}

func (s *Session) GetFlush(key string) string {
	res := ""
	if val, found := s.sess.Values[key]; found {
		ok := false
		if res , ok = val.(string); !ok {
			return ""
		}
	}
	s.Delete(key)
	s.Save()
	return res
}

func (s *Session) Login(ac *account.Account) error {
	return nil
}

func (s *Session) Logout() error {
	return nil
}

func (s *Session) GetAccount() *account.Account {
	return nil
}

func (s *Session) GetAndValidAccount(accountId string) (*account.Account, error) {
	return nil, exception.NOT_LOGGEDIN
}

func (s *Session) Get(key string) interface{} {
	if val, found := s.sess.Values[key]; found {
		return val
	}
	return nil
}

func (s *Session) Put(key string, src interface{}) {
	s.sess.Values[key] = src
}

