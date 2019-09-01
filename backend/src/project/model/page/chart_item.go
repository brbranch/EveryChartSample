package page

/** チャートを形成するアイテム */
type ChartItem struct {
	AuthorID string
	Disabled  bool
	CommentType CommentType
	Values    []Evaluate  // 評価
}

func (c ChartItem) ValueToInts() []int {
	res := []int{}
	for _, val := range c.Values {
		res = append(res, val.Value())
	}
	return res
}

func (c ChartItem) HasValue() bool {
	return !c.Disabled && c.CommentType.HasEvaluate()
}

func (c ChartItem) HasComment() bool {
	return !c.Disabled && c.CommentType.IsComment()
}

