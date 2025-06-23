import { create } from 'ipfs-http-client';

const ipfs = create({
  host: '127.0.0.1',
  port: 5001,
  protocol: 'http',
});

export const uploadFileToIPFS = async (file) => {
  try {
    const { cid } = await ipfs.add(file);
    console.log('IPFS CID:', cid.toString());
    return cid.toString();
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const getFileFromIPFS = async (cid) => {
  try {
    const stream = ipfs.cat(cid);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    console.log('File retrieved from IPFS:', cid);
    // Объединяем chunks в Uint8Array
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  } catch (error) {
    console.error('Error retrieving file from IPFS:', error);
    throw error;
  }
};