import "dotenv/config";
import { RCDEClient3Legged } from "../src/client-3-legged";

async function getContractorClient() {
  const domain = process.env.DOMAIN;
  const baseUrl = process.env.BASE_URL;
  const clientId = process.env.CLIENT_ID_CONTRACTOR;
  const clientSecret = process.env.CLIENT_SECRET_CONTRACTOR;
  const authCode = process.env.AUTH_CODE_CONTRACTOR;

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
  getContractorClient
}
