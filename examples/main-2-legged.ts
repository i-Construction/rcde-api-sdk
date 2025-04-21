import "dotenv/config";
import { RCDEClient2Legged } from "../src/client-2-legged";
import fs from "fs";

async function createConstruction(client: RCDEClient2Legged) {
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
  console.log(domain, baseUrl, clientId, clientSecret);

  // console.log(buffer.byteLength);

  const client = new RCDEClient2Legged({
    domain,
    baseUrl: baseUrl!,
    clientId: clientId!,
    clientSecret: clientSecret!,
  });
  await client.authenticate();

  // const name = "bunny.csv";
  const name = "uav.txt";
  const buffer = fs.createReadStream(`assets/${name}`);
  const size = fs.statSync(`assets/${name}`).size;

  // await createConstruction(client);

  const list = await client.getConstructionList();

  const { constructions } = list;
  constructions?.forEach(async (construction) => {
    const getRes = await client.getConstruction(construction.id!);
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
        const url = await client.getContractFileDownloadUrl(
          contractId,
          contractFile.id!
        );
        // console.log("presignedURL", url);

        const status = await client.getContractFileProcessingStatus(
          contractId,
          contractFile.id!
        );
        console.log(contractFile.id, contractFile.name, "status", status);

        /*
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
        console.log("meta", meta);
        */

        /*
        const { coordinates } = meta;
        Object.keys(coordinates).forEach((l) => {
          const addresses = Object.keys(coordinates[l]);
          addresses.forEach(async (address) => {
            const level = parseInt(l);
            const position = await client.getContractFileImagePosition({
              contractId,
              contractFileId: contractFile.id,
              level,
              addr: address,
            });
            console.log("position", position.byteLength);
            const color = await client.getContractFileImageColor({
              contractId,
              contractFileId: contractFile.id,
              level,
              addr: address,
            });
            console.log("color", color.byteLength);
          });
        });
        */
      });

      /*
      const uploadRes = await client.uploadContractFile({
        contractId: contract.id,
        name,
        buffer,
        size,
      });
      console.log(uploadRes);
      */

      // const updateRes = await client.updateContract(contract.id, { name: `Updated Contract ${Math.random()}`, });
      // console.log(updateRes);

      // const deleteRes = await client.deleteContract(contract.id);
      // console.log(deleteRes);
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
