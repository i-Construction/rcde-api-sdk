import "dotenv/config";
import { RCDEClient } from "../src/client";

async function main() {
  const domain = process.env.DOMAIN;
  const baseUrl = process.env.BASE_URL;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const authCode = process.env.AUTH_CODE;
  console.log(domain, baseUrl, clientId, clientSecret, authCode);

  // console.log(buffer.byteLength);

  const client = new RCDEClient({
    domain,
    baseUrl,
    clientId,
    clientSecret,
    authCode,
  });
  await client.authenticate();

  const list = await client.getConstructionList();
  console.log(list);

  /*
  const { constructions } = list;
  constructions?.forEach(async (construction) => {
    const getRes = await client.getConstruction(construction.id);
    console.log(getRes);
  });
  */
}

new Promise(async () => {
  await main();
});
