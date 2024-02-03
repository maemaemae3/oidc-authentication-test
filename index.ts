import express from "express";
import {
  getAuthorizationParams,
  getAuthorizationUrl,
  getOIDCClient,
} from "./oidc";
import { RedirectUri } from "./constants";
import open from "open";

const PORT = process.env.PORT || 40801;
const authorizationParams = getAuthorizationParams();

const app = express();

app.use(express.json());

app.use("*", async (req, res, next) => {
  try {
    const payload = {
      protocol: req.protocol,
      method: req.method,
      headers: req.headers,
      path: req.originalUrl,
      host: req.hostname,
      data: req.body,
    };

    console.log(payload);
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: (error as any).message,
    });
  }
});

app.get("/cli/callback", async (req, res, next) => {
  const oidcClient = await getOIDCClient();
  const params = oidcClient.callbackParams(req);
  const { codeVerifier, nonce, state } = authorizationParams;
  const tokenSet = await oidcClient.callback(RedirectUri, params, {
    code_verifier: codeVerifier,
    nonce,
    state,
  });
  console.log(`received and validated tokens`, tokenSet);
  console.log(`validated ID Token claims`, tokenSet.claims());

  return res.json({ message: "callback" });
});

app.listen(PORT, async () => {
  const authorizationURL = await getAuthorizationUrl(authorizationParams);
  open(authorizationURL);

  console.log(`listens to ${PORT}`);
});
