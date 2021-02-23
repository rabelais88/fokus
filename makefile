E2E_COMPOSE_FILE=e2e.docker-compose.yml -f ./e2e/cy-open.yml
cypress-up:
	docker-compose -f ${E2E_COMPOSE_FILE} --build --exit-code-from cypress up
cypress-down:
	docker-compose -f ${E2E_COMPOSE_FILE} down