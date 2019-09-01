package notebook


type Permission string

const (
	PermissionSelf Permission = "self"
	PermissionLogin Permission = "loggedin"
)

type EditPermission = Permission

func (p Permission) String() string {
	return string(p)
}

func (p Permission) IsSelfOnly() bool {
	return p == PermissionSelf
}

func (p Permission) MustLoggedIn() bool {
	return p == PermissionLogin
}

