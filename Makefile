.PHONY: build build-all clean test install help check-go

# Check if Go is installed
check-go:
	@which go > /dev/null || (echo "❌ Go is not installed!" && echo "" && echo "Please install Go first:" && echo "  • macOS: brew install go" && echo "  • Linux: sudo apt install golang-go  (Ubuntu/Debian)" && echo "  •        sudo yum install golang     (RHEL/CentOS)" && echo "  • Windows: Download from https://golang.org/dl/" && echo "" && echo "Or download from: https://golang.org/dl/" && exit 1)

# Build for current platform
build: check-go
	go build -o genesis ./cmd/genesis

# Build for all platforms
build-all: check-go
	GOOS=linux GOARCH=amd64 go build -o dist/genesis-linux-amd64 ./cmd/genesis
	GOOS=linux GOARCH=arm64 go build -o dist/genesis-linux-arm64 ./cmd/genesis
	GOOS=darwin GOARCH=amd64 go build -o dist/genesis-darwin-amd64 ./cmd/genesis
	GOOS=darwin GOARCH=arm64 go build -o dist/genesis-darwin-arm64 ./cmd/genesis
	GOOS=windows GOARCH=amd64 go build -o dist/genesis-windows-amd64.exe ./cmd/genesis

# Create dist directory and build all
dist: clean
	mkdir -p dist
	$(MAKE) build-all

# Clean build artifacts
clean:
	rm -f genesis
	rm -rf dist/

# Test the application
test: check-go
	go test ./...

# Install locally
install: check-go
	go install ./cmd/genesis

# Development mode - build and test
dev:
	$(MAKE) build
	./genesis --help

# Show help
help:
	@echo "Available targets:"
	@echo "  build      - Build for current platform"
	@echo "  build-all  - Build for all platforms"
	@echo "  dist       - Create distribution binaries"
	@echo "  clean      - Clean build artifacts"
	@echo "  test       - Run tests"
	@echo "  install    - Install locally"
	@echo "  dev        - Build and test locally"
	@echo "  help       - Show this help" 