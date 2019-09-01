package data

import (
	"time"
	"project/model"
)

type Entity struct {
	ID          string         `foon:"id" firestore:"id"`
	CreatedAt   time.Time      `firestore:"createdAt"`
	UpdatedAt   time.Time      `firestore:"updatedAt"`
}

func NewEntity(id string) Entity {
	return Entity{
		ID: id,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}


func (e *Entity) GetID() string {
	return e.ID
}

func (e *Entity) GetCreatedAt() time.Time {
	return e.CreatedAt
}

func (e *Entity) GetUpdatedAt() time.Time {
	return e.UpdatedAt
}

func (e *Entity) SyncCoreData(entity model.IEntity) {
	e.ID = entity.GetID()
	e.CreatedAt = entity.GetCreatedAt()
	e.UpdatedAt = time.Now()
}