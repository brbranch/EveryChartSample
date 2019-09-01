package exception

import (
	"fmt"
	"io"
)

const no_such_entity_error = "no such entity."

type NoSuchEntity struct {
	message string
}

func NoSuchEntityError(message string) NoSuchEntity {
	return NoSuchEntity{message:message}
}

func (NoSuchEntity) Is(err error) bool {
	return NO_SUCH_ENTITY.Is(err)
}

func (w NoSuchEntity) Error() string {
	return "no such entity."
}

func (w *NoSuchEntity) Format(s fmt.State, verb rune) {
	switch verb {
	case 'v':
		fmt.Fprintf(s, "%s (%s)", w.Error(), w.message)
	case 's', 'q':
		io.WriteString(s, w.Error())
	}
}

