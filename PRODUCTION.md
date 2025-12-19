Production build & publish

Build locally with Docker Compose (production):

```bash
# from repo root
docker compose -f docker-compose.prod.yml build --parallel
docker compose -f docker-compose.prod.yml up -d
```

Notes:
- The `client` image is a multi-stage build that outputs static files into an `nginx`-based image (serving on port 80).
- `nginx` service (in `docker-compose.prod.yml`) proxies `/` to the `client` container and `/api` to the `server` container.
- The `server` Dockerfile builds TypeScript to `dist` and runs `npm start` in production.

Publishing to a registry (example):

```bash
# build images
docker compose -f docker-compose.prod.yml build

# tag and push, e.g. for client
docker tag tgxobot_client:latest myregistry.example.com/tgxobot/client:latest
docker push myregistry.example.com/tgxobot/client:latest

# repeat for server and nginx (if you want a custom nginx image)
```
