.PHONY: build build-all clean test install help

# Build for current platform
build:
	go build -o genesis ./cmd/genesis

# Build for all platforms
build-all:
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
test:
	go test ./...

# Install locally
install:
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