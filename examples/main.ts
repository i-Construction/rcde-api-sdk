import "dotenv/config";
import { RCDEClient } from "../src/client";
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
  const domain = process.env.DOMAIN;
  const baseUrl = process.env.BASE_URL;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  // console.log(domain, baseUrl, clientId, clientSecret);

  const buffer = fs.readFileSync("assets/bunny.csv");
  // console.log(buffer.byteLength);

  const client = new RCDEClient({
    domain,
    baseUrl,
    clientId,
    clientSecret,
  });
  await client.authenticate();

  // createConstruction(client);

  const list = await client.getConstructionList();
  console.log(list);

  const { constructions } = list;
  constructions?.forEach(async (construction) => {
    const getRes = await client.getConstruction(construction.id);
    console.log(getRes);

    const data = await client.getContractList({
      constructionId: construction.id,
    });
    const { contracts } = data;

    contracts?.forEach(async (contract) => {
      const contractId = contract.id;
      if (contractId === undefined) return;
      const getContractRes = await client.getContract(contractId);
      console.log("contract", getContractRes);

      const list = await client.getContractFileList({
        contractId,
      });
      console.log(list);

      list.contractFiles?.forEach(async (contractFile) => {
        const meta = (await client.getContractFileMetadata({
          contractId,
          contractFileId: contractFile.id,
        })) as any as {
          coordinates: Record<
            string,
            Record<
              string,
              {
                min: [number, number, number];
                max: [number, number, number];
              }
            >
          >;
        };
        const { coordinates } = meta;
        Object.keys(coordinates).forEach((l) => {
          const addresses = Object.keys(coordinates[l]);
          addresses.forEach(async (address) => {
            const img = await client.getContractFileImagePosition({
              contractId,
              contractFileId: contractFile.id,
              level: l,
              addr: address,
            });
            console.log(img.byteLength);
          });
        });
      });

      /*
      const uploadRes = await client.uploadContractFile({
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
