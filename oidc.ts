import { Issuer, generators } from "openid-client";
import { ClientId, RedirectUri, ConfigurationUrl, Scopes } from "./constants";

type AuthorizationParams = {
  codeVerifier: string;
  nonce: string;
  state: string;
};

export const getOIDCClient = async () => {
  const issuer = await Issuer.discover(ConfigurationUrl);
  const client = new issuer.Client({
    client_id: ClientId,
    redirect_uris: [RedirectUri],
    response_types: ["code"],
    token_endpoint_auth_method: "none",
  });

  return client;
};

export const getAuthorizationParams = (): AuthorizationParams => {
  const codeVerifier = generators.codeVerifier();
  const nonce = generators.nonce();
  const state = generators.state();

  return {
    codeVerifier,
    nonce,
    state,
  };
};

export const getAuthorizationUrl = async ({
  codeVerifier,
  nonce,
  state,
}: AuthorizationParams) => {
  const oidcClient = await getOIDCClient();

  const codeChallenge = generators.codeChallenge(codeVerifier);
  const authorizationUrl = oidcClient.authorizationUrl({
    scope: Scopes,
    nonce,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    access_type: "offline",
  });

  return authorizationUrl;
};
