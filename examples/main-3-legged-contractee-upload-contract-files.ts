import "dotenv/config";
import fs from "fs";
import { getContracteeClient } from "./3-legged-contractee";

async function main() {
  const client = await getContracteeClient();
  const contractId = 10;

  const contract = await client.getContract(contractId);
  console.log(contract);

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
      contractId,
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
}

new Promise(async () => {
  await main();
});
