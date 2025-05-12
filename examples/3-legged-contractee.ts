import "dotenv/config";
import { RCDEClient3Legged } from "../src/client-3-legged";

async function getContracteeClient() {
  const domain = process.env.DOMAIN;
  const baseUrl = process.env.BASE_URL;
  const clientId = process.env.CLIENT_ID_CONTRACTEE;
  const clientSecret = process.env.CLIENT_SECRET_CONTRACTEE;
  const authCode = process.env.AUTH_CODE_CONTRACTEE;

  const client = new RCDEClient3Legged({
    domain,
    baseUrl: baseUrl!,
    clientId: clientId!,
    clientSecret: clientSecret!,
    authCode: authCode!,
  });
  await client.authenticate();
  return client;
}

export {
  getContracteeClient
};

