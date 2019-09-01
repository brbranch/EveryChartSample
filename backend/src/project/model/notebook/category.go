package notebook

type Category string

func (c Category) String() string {
	return string(c)
}

const (
	CategoryAll Category = "all"
)