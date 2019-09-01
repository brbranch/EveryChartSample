package notebook

type Item string

type Items struct {
	Items []Item
}

func NewItems(itemNames []string) Items {
	items := Items{}
	for _ , itemName := range itemNames {
		items.Items = append(items.Items, Item(itemName))
	}
	return items
}

func (i Items) StringList() []string {
	res := []string{}
	for _ , item := range i.Items {
		res = append(res, string(item))
	}
	return res
}