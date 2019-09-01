package top

import "project/mapper"

type RecentPageResponse struct {
	Items      []mapper.NotebookPage `json:"items"`
	NextCursor string                `json:"next"`
}

type RecentNotebookResponse struct {
	Items      []*mapper.Notebook `json:"items"`
	NextCursor string             `json:"next"`
}
