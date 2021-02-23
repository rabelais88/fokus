cypress-up:
	docker-compose -f e2e.docker-compose.yml -f ./e2e/cy-open.yml up
cypress-down:
	docker-compose -f e2e.docker-compose.yml -f ./e2e/cy-open.yml