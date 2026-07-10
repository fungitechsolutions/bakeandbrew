#!/bin/sh
migrate -path ./migrations -database $DATABASE_URL up
exec air