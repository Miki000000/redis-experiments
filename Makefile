.PHONY: integration-test

integration-test:
	@docker compose --profile test build app >/dev/null 2>&1
	@docker compose --profile test up -d redis >/dev/null 2>&1
	@docker compose --profile test run --rm --no-deps app
	@code=$$?; docker compose --profile test down -v >/dev/null 2>&1; exit $$code
