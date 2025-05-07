import "dotenv/config";
import { RCDEClient3Legged } from "../src/client-3-legged";
import fs from "fs";
import { getContracteeClient } from "./3-legged-contractee";

async function main() {
  // console.log(buffer.byteLength);

  const client = await getContracteeClient();

  return;
  /*

  const name = "bunny.csv";
  // const buffer = fs.createReadStream(`assets/${name}`);
  // const size = fs.statSync(`assets/${name}`).size;
  // get buffer from file
  const buffer = fs.readFileSync(`assets/${name}`);
  const size = buffer.byteLength;
  const chunkSize = size / 3;
  console.log(chunkSize);

  try {
    const res = await client.uploadContractFile({
      contractId: contract.id!,
      name,
      buffer,
      chunkSize,
    });
    console.log(res);
  } catch (e) {
    console.error(e);
    // write error to file
    fs.writeFileSync(`error.txt`, JSON.stringify(e, null, 2));
  }

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
