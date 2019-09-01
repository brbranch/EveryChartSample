package page

type CommentType int

const (
	CommentTypeUnknown CommentType = 0
	CommentTypeEvaluateOnly CommentType = 1
	CommentTypeCommentOnly  CommentType = 2
	CommentTypeBoth  CommentType = 3
)

func (c CommentType) String() string {
	switch c {
	case CommentTypeEvaluateOnly:
		return "evaluate"
	case CommentTypeCommentOnly:
		return "comment"
	case CommentTypeBoth:
		return "both"
	default:
		return ""
	}
}

func NewCommentType(comment string) CommentType {
	switch comment {
	case "evaluate":
		return CommentTypeEvaluateOnly
	case "comment":
		return CommentTypeCommentOnly
	case "both":
		return CommentTypeBoth
	default:
		return CommentTypeUnknown
	}
}

func (c CommentType) HasEvaluate() bool {
	return c == CommentTypeEvaluateOnly || c == CommentTypeBoth
}

func (c CommentType) IsComment() bool {
	return c == CommentTypeCommentOnly || c == CommentTypeBoth
}