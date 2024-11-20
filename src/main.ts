import "dotenv/config";
import { RCDEClient } from "./client";
import fs from "fs";

async function createConstruction(client: RCDEClient) {
  const data = await client.createConstruction({
    name: "Test Construction",
    address: "amagasaki",
    contractedAt: new Date(),
    period: new Date(),
    advancePaymentRate: 1,
    contractAmount: 10000,
  });
  console.log(data);
}

async function main() {
  const origin = process.env.DOMAIN;
  const baseURL = process.env.BASE_URL;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const buffer = fs.readFileSync("assets/bunny.csv");
  // console.log(buffer.byteLength);

  const client = new RCDEClient({
    domain: origin,
    baseUrl: baseURL,
    clientId,
    clientSecret,
  });
  await client.authenticate();

  // createConstruction(client);

  const list = await client.getConstructionList();

  const { constructions } = list;
  constructions.forEach(async (construction) => {
    const getRes = await client.getConstruction(construction.id);
    console.log(getRes);

    const data = await client.getContractList({
      constructionId: construction.id,
    });
    const { contracts } = data;

    contracts.forEach(async (contract) => {
      const getContractRes = await client.getContract(contract.id);
      console.log("contract", getContractRes);

      /*
      const uploadRes = await client.uploadPointCloud({
        contractId: contract.id,
        name: "buffer.csv",
        buffer,
      });
      console.log(uploadRes);
      */

      // const updateRes = await client.updateContract(contract.id, { name: `Updated Contract ${Math.random()}`, });
      // console.log(updateRes);

      // const deleteRes = await client.deleteContract(contract.id);
      // console.log(deleteRes);

      /*
      client.createPointCloudUploadUrl({
        contractId: contract.id,
        name: "Test Point Cloud",
        type: "LAS",
        pointCloudAttribute: {
        }
      });
      */
    });

    /*
    const deleteConstructionRes = await client.deleteConstruction(
      construction.id
    );
    console.log(deleteConstructionRes);
    */

    /*
    const createContractRes = await client.createContract({
      constructionId: construction.id,
      name: "Test Contract",
      contractedAt: new Date(),
      unitPrice: 100,
      unitVolume: 1,
    });
    console.log(createContractRes);
    */
  });
}

new Promise(async () => {
  await main();
});
