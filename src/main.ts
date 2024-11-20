import { Api } from "./api";
import "dotenv/config";
import { RCDEClient } from "./client";

async function main() {
  const origin = process.env.DOMAIN;
  const baseURL = process.env.BASE_URL;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  /*
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
  */

  const client = new RCDEClient({
    domain: origin,
    baseUrl: baseURL,
    clientId,
    clientSecret,
  });
  await client.authenticate();

  /*
  const data = await client.createConstruction({
    name: "Test Construction",
    address: "amagasaki",
    contractedAt: new Date(),
    period: new Date(),
    advancePaymentRate: 1,
    contractAmount: 10000
  });
  console.log(data);
  */

  const list = await client.getConstructionList();
  // console.log(list);

  const { constructions } = list;
  constructions.forEach((construction) => {
    client.getConstruction(construction.id).then((data) => {
      client
        .getContractList({
          constructionId: construction.id,
        })
        .then((data) => {
          console.log("getContractList", data);
        });

      /*
      client
        .createContract({
          constructionId: construction.id,
          name: "Test Contract",
          contractedAt: new Date(),
          unitPrice: 100,
          unitVolume: 1,
        })
        .then((data) => {
          console.log("createContract", data);
        });
      */

      /*
      client.deleteConstruction(construction.id).then((data) => {
        console.log('deleted', data);
      });
      */
    });
  });
}

new Promise(async () => {
  await main();
});
