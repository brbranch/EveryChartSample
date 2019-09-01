package storage

import (
	"net/url"
	"strings"
	"errors"
	"fmt"
)

const DefaultStoragePath = "https://storage.googleapis.com"

type GcsPath struct {
	BucketName string
	FolderName string
	FileName  string
}

func NewGcsPathFromUrl(urlString string) (*GcsPath, error) {
	if !strings.HasPrefix(urlString, DefaultStoragePath) {
		return nil, errors.New("invalid url")
	}
	u, err := url.Parse(urlString)
	if err != nil {
		return nil, err
	}
	paths := strings.Split(u.Path[1:], "/")
	length := len(paths)
	if length < 2 {
		return nil, errors.New("invalid path")
	}
	if length == 2 {
		return &GcsPath{
			BucketName: paths[0],
			FolderName: "",
			FileName: paths[1],
		}, nil
	}

	fmt.Println(paths)

	bucket := paths[0]
	folder := strings.Join(paths[1:length-1], "/")
	file := paths[length - 1]

	return &GcsPath{bucket, folder, file} , nil
}

func (g GcsPath) LinkPath() string {
	if g.FolderName == "" {
		return fmt.Sprintf("%s/%s/%s", DefaultStoragePath, g.BucketName, g.FileName)
	}
	return fmt.Sprintf("%s/%s/%s/%s", DefaultStoragePath, g.BucketName, g.FolderName, g.FileName)
}

func (g GcsPath) ObjectPath() string {
	if g.FolderName == "" {
		return g.FileName
	}
	return fmt.Sprintf("%s/%s", g.FolderName, g.FileName)
}

