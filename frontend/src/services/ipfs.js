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