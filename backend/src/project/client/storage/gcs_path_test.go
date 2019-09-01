package storage

import (
	"testing"
	"github.com/stretchr/testify/assert"
)

func TestNewGcsPathFromUrl_正常(t *testing.T) {
	test := "https://storage.googleapis.com/test.appspot.com/test/5107a5a5-4c18-4fd7-89bd-9cc95a7e29fe.jpeg"
	gcs, err := NewGcsPathFromUrl(test)
	if err != nil {
		t.Fatalf("failed to create gcsPath", err)
	}
	assert.Equal(t, "test.appspot.com", gcs.BucketName)
	assert.Equal(t, "test", gcs.FolderName)
	assert.Equal(t, "5107a5a5-4c18-4fd7-89bd-9cc95a7e29fe.jpeg", gcs.FileName)
	assert.Equal(t, test, gcs.LinkPath())
	assert.Equal(t, "test/5107a5a5-4c18-4fd7-89bd-9cc95a7e29fe.jpeg", gcs.ObjectPath())
}

func TestNewGcsPathFromUrl_フォルダ複数正常(t *testing.T) {
	test := "https://storage.googleapis.com/test.appspot.com/test1/test2/5107a5a5-4c18-4fd7-89bd-9cc95a7e29fe.jpeg"
	gcs, err := NewGcsPathFromUrl(test)
	if err != nil {
		t.Fatalf("failed to create gcsPath", err)
	}
	assert.Equal(t, "test.appspot.com", gcs.BucketName)
	assert.Equal(t, "test1/test2", gcs.FolderName)
	assert.Equal(t, "5107a5a5-4c18-4fd7-89bd-9cc95a7e29fe.jpeg", gcs.FileName)
	assert.Equal(t, test, gcs.LinkPath())
	assert.Equal(t, "test1/test2/5107a5a5-4c18-4fd7-89bd-9cc95a7e29fe.jpeg", gcs.ObjectPath())
}


func TestNewGcsPathFromUrl_フォルダなし正常(t *testing.T) {
	test := "https://storage.googleapis.com/test.appspot.com/5107a5a5-4c18-4fd7-89bd-9cc95a7e29fe.jpeg"
	gcs, err := NewGcsPathFromUrl(test)
	if err != nil {
		t.Fatalf("failed to create gcsPath", err)
	}
	assert.Equal(t, "test.appspot.com", gcs.BucketName)
	assert.Equal(t, "", gcs.FolderName)
	assert.Equal(t, "5107a5a5-4c18-4fd7-89bd-9cc95a7e29fe.jpeg", gcs.FileName)
	assert.Equal(t, test, gcs.LinkPath())
	assert.Equal(t, "5107a5a5-4c18-4fd7-89bd-9cc95a7e29fe.jpeg", gcs.ObjectPath())
}


