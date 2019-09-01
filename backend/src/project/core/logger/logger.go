package logger

import (
	"context"
	"fmt"
	"os"
	"runtime"
	"strings"

	"google.golang.org/appengine/log"
)

const (
	trace      = 0
	debug      = 1
	info       = 2
	warning    = 3
	levelerror = 4
	fatal      = 5
)

type Logger struct {
	ctx    context.Context
	level  int
	coller int
}

func NewLogger(ctx context.Context) *Logger {
	return NewLoggerWithCaller(ctx, 2)
}

func NewLoggerWithCaller(ctx context.Context, caller int) *Logger {
	log := new(Logger)
	log.ctx = ctx
	log.coller = caller
	return log
}

func (l *Logger) init() {
	level := strings.ToUpper(os.Getenv("LOGLEVEL"))
	switch level {
	case "DEBUG":
		l.level = debug
	case "INFO":
		l.level = info
	case "WARNING":
		l.level = warning
	case "ERROR":
		l.level = levelerror
	case "FATAL":
		l.level = fatal
	default:
		l.level = trace
	}
}

func (l *Logger) printLog(level int, levelStr string, format string, args ...interface{}) {
	if l.level > level {
		return
	}
	text := fmt.Sprintf(format, args...)
	pt, file, line, ok := runtime.Caller(l.coller)
	funcName := "unknown"
	if ok {
		funcName = runtime.FuncForPC(pt).Name()
	}

	if level == warning {
		log.Warningf(l.ctx, "[%s] %s::%s:L%d %s", levelStr, file, funcName, line, text)
		return
	}
	if level == levelerror {
		log.Errorf(l.ctx, "[%s] %s::%s:L%d %s", levelStr, file, funcName, line, text)
		return
	}
	if level >= fatal {
		log.Criticalf(l.ctx, "[%s] %s::%s:L%d %s", levelStr, file, funcName, line, text)
		return
	}
	log.Infof(l.ctx, "[%s] %s::%s:L%d %s", levelStr, file, funcName, line, text)
}

func (l *Logger) Tracef(format string, args ...interface{}) {
	l.printLog(trace, "TRACE", format, args...)
}

func (l *Logger) Debugf(format string, args ...interface{}) {
	l.printLog(debug, "DEBUG", format, args...)
}

func (l *Logger) Infof(format string, args ...interface{}) {
	l.printLog(info, "INFO", format, args...)
}

func (l *Logger) Warningf(format string, args ...interface{}) {
	l.printLog(warning, "WARN", format, args...)
}

func (l *Logger) Errorf(format string, args ...interface{}) {
	l.printLog(levelerror, "ERROR", format, args...)
}

func (l *Logger) Fatalf(format string, args ...interface{}) {
	l.printLog(fatal, "FATAL", format, args...)
}

func (l *Logger) Warning(message string, err error) {
	l.Warningf("%s \n cause by: \n", message, err)
}

func (l *Logger) Error(message string, err error) {
	l.Errorf("%s \n cause by: \n", message, err)
}

func (l *Logger) Fatal(message string, err error) {
	l.Fatalf("%s \n cause by: \n", message, err)
}

func Tracef(ctx context.Context, format string, args ...interface{}) {
	logger := NewLogger(ctx)
	logger.Tracef(format, args...)
}

func Debugf(ctx context.Context, format string, args ...interface{}) {
	logger := NewLogger(ctx)
	logger.Debugf(format, args...)
}

func Infof(ctx context.Context, format string, args ...interface{}) {
	logger := NewLogger(ctx)
	logger.Infof(format, args...)
}

func Warningf(ctx context.Context, format string, args ...interface{}) {
	logger := NewLogger(ctx)
	logger.Warningf(format, args...)
}

func Errorf(ctx context.Context, format string, args ...interface{}) {
	logger := NewLogger(ctx)
	logger.Errorf(format, args...)
}
