package storage

import (
	"os"
	"project/core"
	"cloud.google.com/go/storage"
	"google.golang.org/appengine/log"
	"strings"
	"encoding/base64"
	"github.com/satori/go.uuid"
	"fmt"
	"errors"
	"time"
)

type GoogleCloudStorage struct {
	core.Context
}

type StorageURL string

func (s StorageURL) Path() string {
	return string(s)
}

func NewStorageURL(bucket string, name string) StorageURL {
	return StorageURL(fmt.Sprintf("https://storage.googleapis.com/%s/%s", bucket, name))
}

func NewStorage(ctx core.Context) *GoogleCloudStorage {
	return &GoogleCloudStorage{ctx}
}

func (c *GoogleCloudStorage) DeleteImage(imageUrl string) error {
	if imageUrl == "" {
		return errors.New("imageUrl is empty")
	}
	gcsPath, err := NewGcsPathFromUrl(imageUrl)
	if err != nil {
		return err
	}

	client ,err := storage.NewClient(c)
	if err != nil {
		return err
	}

	return client.Bucket(gcsPath.BucketName).Object(gcsPath.ObjectPath()).Delete(c)
}

func (c *GoogleCloudStorage) UploadBase64(base64String string) (StorageURL, error) {
	client ,err := storage.NewClient(c)
	if err != nil {
		return "", err
	}
	contentType := "image/png"
	extension := "png"
	if (base64String[:4] == "data") {
		contentType = base64String[5:strings.Index(base64String,";")]
		extension = contentType[6:]
		base64String = base64String[strings.Index(base64String, ",") + 1:]
		log.Infof(c,"contentType: %s ext: %s", contentType, extension)
	}
	decodeStr, err := base64.StdEncoding.DecodeString(base64String)
	if err != nil {
		return "", err
	}
	bucket := os.Getenv("BUCKET")
	ym := time.Now()
	name := fmt.Sprintf("%s/%d%02d/%s.%s", os.Getenv("GCSPATH"), ym.Year(), ym.Month(), uuid.NewV4().String(), extension)

	writer := client.Bucket(bucket).Object(name).NewWriter(c)
	writer.ContentType = contentType
	writer.ACL = []storage.ACLRule{
		storage.ACLRule{
			Entity: storage.AllUsers,
			Role: storage.RoleReader,
		},
	}

	if _ , err := writer.Write(decodeStr); err != nil {
		log.Warningf(c, "failed to write base64 (reason: err)", err)
		return "", err
	}

	if err := writer.Close(); err != nil {
		log.Warningf(c,"failed to close gcs writer : %v", err)
		return "",  err
	}

	return NewStorageURL(bucket, name), nil
}
