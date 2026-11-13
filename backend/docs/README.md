# AI WorkMate API documentation

This directory contains the backend API contract and interactive Swagger documentation.

## Files

- `openapi.json` is the canonical OpenAPI 3.1 specification. It can be imported into Postman, Insomnia, code generators, API gateways, and OpenAPI-compatible validation tools.
- `swagger.html` renders `openapi.json` with Swagger UI and provides an interactive request explorer.

## Viewing Swagger UI

Start the backend:

```bash
npm run dev
```

Then open:

```text
http://localhost:5000/api/docs/
```

Swagger UI loads its browser assets from the public `unpkg.com` CDN. The OpenAPI document itself is served locally at:

```text
http://localhost:5000/api/docs/openapi.json
```

## Testing protected endpoints

1. Run `POST /api/auth/login` in Swagger UI.
2. Copy `data.accessToken` from the response.
3. Select **Authorize**.
4. Paste the token value. Do not include the `Bearer` prefix; Swagger adds it automatically.
5. Run authenticated user or administrator operations.

## Keeping the contract current

Update `openapi.json` whenever a route, request body, validation rule, response, authentication rule, or status code changes. Validate the JSON and exercise affected endpoints in Swagger UI before committing changes.
