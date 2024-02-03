# oidc-local-callback-handler

This is a sample app to handle OIDC callback locally.
This app is designed for [public](https://datatracker.ietf.org/doc/html/rfc6749#section-2.1:~:text=using%20other%20means.-,public,-Clients%20incapable%20of) client type

## Prerequisites

- [Bun](https://bun.sh)

## setup OIDC provider

use keycloak for OIDC provider

```bash
$ docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:23.0.6 start-dev
```

## Setup OIDC client

1. Access to `http://localhost:8080/auth/` and login with admin/admin
1. Create Realm
1. Create client
    - Root URL and Home URL can be empty
    - Valid Redirect URIs: `http://localhost:40801/cli/callback`
    - Valid post logout redirect URIs: `http://localhost:40801`
    - Web Origins: `http://localhost:40801`
1. Create user
    - Set password from Credentials tab (set temporary toggle to off)

## Setup app

1. Copy `.env.example` to `.env`
1. Set `CLIENT_ID` and `REDIRECT_URI`, `OPENID_CONFIGURATION_URL` in `.env`
    - `OPENID_CONFIGURATION_URL` is `http://0.0.0.0:8080/realms/{realm-name}/.well-known/openid-configuration`
1. Install dependencies with `bun install`

## Run

```bash
$ bun run dev
```