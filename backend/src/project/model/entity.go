package model

import "time"

type ID string
type CreatedAt time.Time
type UpdatedAt time.Time

type IEntity interface {
	GetID() string
	GetCreatedAt() time.Time
	GetUpdatedAt() time.Time
}

type IModel interface {
	SyncCoreData(entity IEntity)
}

