# scripts/build-and-run-docker.ps1
$ErrorActionPreference = "Stop"
docker compose build
docker compose up productivity-hub
