package account

type AccountStatus string

const (
	AccountStatusAvailable AccountStatus = "available"
	AccountStatusDuplicate AccountStatus = "duplicate"
	AccountStatusDisabled AccountStatus = "disabled"
	AccountStatusDeleted AccountStatus = "deleted"
	AccountStatusSignUp AccountStatus = "signup"
	AccountStatusSignIn AccountStatus = "available"
)

func (a AccountStatus) IsDelete() bool {
	return a == AccountStatusDeleted
}

func (a AccountStatus) IsDuplicate() bool {
	return a == AccountStatusDuplicate
}

func (a AccountStatus) IsDisabled() bool {
	return a == AccountStatusDisabled
}

func (a AccountStatus) IsAvailable() bool {
	return !a.IsDisabled() && !a.IsDuplicate()
}