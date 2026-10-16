.PHONY: dev build preview clean help

help:
	@echo "React + Vite + RST Static Portfolio Commands:"
	@echo "  make dev      - Compile RST and start Vite live server on http://localhost:3000"
	@echo "  make build    - Compile RST and create production bundle in dist/"
	@echo "  make preview  - Preview production build locally"
	@echo "  make clean    - Remove build artifacts (dist/)"

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf dist
