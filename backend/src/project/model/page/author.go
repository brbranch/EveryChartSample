package page

import "project/model/account"

type Author struct {
	AuthorID AuthorID
	Image    string
	Name     string
}

type AuthorID string
const Anonymous AuthorID = "anonymous"

func NewAnonymous() Author {
	return Author{
		Anonymous,
		"",
		"",
	}
}

func Unsubscriber() Author {
	return Author {
		"",
		"",
		"退会",
	}
}

func NewAuthor(authorID string, image string, name string) Author {
	return Author{
		AuthorID:AuthorID(authorID),
		Image: image,
		Name: name,
	}
}

func NewAuthorWithAcount(ac *account.Account) Author {
	if ac == nil {
		return NewAnonymous()
	}
	return NewAuthor(ac.ID, ac.Image(), ac.Name())
}


func (a AuthorID) String() string {
	return string(a)
}

func (a AuthorID) Equals(id string) bool {
	return a.String() == id
}

func (a Author) IsSame(ac *account.Account) bool {
	return ac != nil && a.AuthorID.Equals(ac.ID)
}