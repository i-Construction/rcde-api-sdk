import { Api } from "./api";
import 'dotenv/config';

async function main() {
  const origin = process.env.DOMAIN;
  const baseURL = process.env.BASE_URL;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const api = new Api();
  const tokenRes = await api.ext.postExtV2AuthToken({
    clientId,
    clientSecret,
  }, {
    baseURL,
    headers: {
      "Origin": origin,
      "Content-Type": "application/json",
    },
  });
  console.log(tokenRes.data);

  const {
    refreshToken
  } = tokenRes.data;
  const refreshRes = await api.ext.postExtV2AuthenticatedRefresh({
    clientId,
    clientSecret,
  }, {
    baseURL,
    headers: {
      "Origin": origin,
      "Content-Type": "application/json",
      "Authorization": `Bearer ${refreshToken}`
    },
  })
  console.log(refreshRes.data);
}

new Promise(async () => {
  await main();
});