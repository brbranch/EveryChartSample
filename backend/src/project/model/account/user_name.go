package account

type UserName struct {
	name string
}

func NewUserName(name string) UserName {
	return UserName{ name: name }
}

func (u UserName) String() string {
	return u.name
}

func (u UserName) Name() string {
	return u.name
}