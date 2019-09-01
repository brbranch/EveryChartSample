package page

import "project/model/account"

/** いいね */
type Likes struct {
	SessionIds []string
}

func NewLikes(ids []string) Likes {
	if ids == nil {
		return Likes{SessionIds:[]string{}}
	}
	return Likes{ ids }
}

func (l Likes) LikeStrings() []string {
	return l.SessionIds
}

func (l Likes) LikeCount() int {
	return len(l.SessionIds)
}

func (l *Likes) AppendLike(targetSessionId string) {
	if l.contains(targetSessionId) {
		return
	}
	l.SessionIds = append(l.SessionIds, targetSessionId)
}

func (l Likes) contains(accountId string) bool {
	for _ , id := range l.SessionIds {
		if id == accountId {
			return true
		}
	}
	return false
}

func (l Likes) IsLike(ac *account.Account) bool {
	return false
}

func (l* Likes) ToggleLike(targetSessionId string) {
	has := false
	res := []string{}
	for _ , id := range l.SessionIds {
		if id == targetSessionId {
			has = true
		} else {
			res = append(res, id)
		}
	}
	if has == false {
		res = append(res, targetSessionId)
	}
	l.SessionIds = res
}