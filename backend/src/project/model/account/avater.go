package account

type Avater struct {
	image string
}

func NewAvater(image string) Avater {
	return Avater{image: image}
}

func (a Avater) String() string {
	return a.image
}

func (a Avater) Image() string {
	return a.image
}