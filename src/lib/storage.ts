import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

const WEB3_STORAGE_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI3NTI4ZjQ3OUYyMzI1NjYxNjA5ZEQ3MGFkNzkwYWMyNjc5MDlDMmYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjAxMjY5MjAyODQsIm5hbWUiOiJzYWZoYSJ9.wLtJgTDKkZ-a1O2NOjvaiQIqWgaZT-KnJsvNaVPv-IM";

const getClient = () => {
  return new Web3Storage({ token: WEB3_STORAGE_TOKEN });
};

const storeFiles = async (files: File[]) => {
  const client = getClient();
  const cid = await client.put(files);
  return cid;
};

const gatewayUrl = (ipfsUrl: string | undefined) => {
  if (ipfsUrl) {
    const [, path] = ipfsUrl.split("ipfs://");
    const [cid, filename] = path.split("/");
    return `https://${cid}.ipfs.dweb.link/${filename}`;
  }
};

const exp = {
  storeFiles,
  gatewayUrl,
};

export default exp;