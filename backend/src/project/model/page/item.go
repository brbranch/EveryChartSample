package page

import "project/model/notebook"

/** 評価項目 */
type Item struct {
	Name string
	Value Evaluate
}

func NewItemsByNotebook(notebook* notebook.Notebook) []Item {
	items := []Item{}
	for _ , item := range notebook.Items.StringList() {
		items = append(items, Item{Name: item, Value: 0})
	}
	return items
}

