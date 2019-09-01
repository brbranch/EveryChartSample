package exception

import "project/client/foon"

type Exception interface {
	error
	Is(err error) bool
}

type ExceptionType string

const (
	NO_SUCH_ENTITY ExceptionType = ExceptionType(foon.NoSuchDocument)
	INVALID_ID ExceptionType = "InvalidID"
	INVALID_REQUEST ExceptionType = "InvalidRequest"
	INVALID_PARAM ExceptionType = "InvalidParam"
	INVALID_SESSION ExceptionType = "InvalidSession"
	ALREADY_EXISTS ExceptionType = "EntityExists"
	NOT_LOGGEDIN ExceptionType = "NotLoggedIn"
	NOT_AUTHORIZED ExceptionType = "NotAuthorized" // 403エラー
	NOT_ALLOWED ExceptionType = "NotAllowed" // パーミッションがない
)

func (e ExceptionType) Error() string {
	return string(e)
}

func (e ExceptionType) Is(err error) bool {
	if exceptionType, ok := err.(*ExceptionType); ok {
		return e == *exceptionType
	}
	if exceptionType, ok := err.(ExceptionType); ok {
		return e == exceptionType
	}
	if exception, ok := err.(Exception); ok {
		return exception.Is(e)
	}
	return false
}

func (e ExceptionType) Not(err error) bool {
	return !e.Is(err)
}
