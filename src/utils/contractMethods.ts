import Web3 from "web3";
import { CONTRACT_ADDRESS } from "../contract/constants";
import contractAbi from "../contract/contractAbi.json";

export const initializeContract = (provider: any, cb) => {
  const web3 = new Web3(provider);
  let contract = new web3.eth.Contract(contractAbi as any, CONTRACT_ADDRESS);
  cb(contract);
};

export const isAddressReserved = async (address, contract: any) => {
  const username = await contract.methods.isAddressReserved(address).call();

  return username;
};

export const createAccount = async (
  args: any[],
  address: string,
  contract: any,
  cb: () => void
) => {
  await contract.methods
    .createAccount(args)
    .send({
      from: address,
      gas: 1000000,
      gasPrice: Web3.utils.toWei("2", "gwei"),
    })
    .on("transactionHash", (hash) => {
      // console.log("hash 0", hash);
    })
    .on("confirmation", function (confirmationNumber, receipt) {
      if (confirmationNumber === 1) {
        cb();
      }
    });
};

export const createPost = async (
  status: string,
  price: string,
  bidDuration: any,
  tokenURI: string,
  address: string,
  setModalText: any,
  contract: any,
  cb: () => void
) => {
  var date = new Date();
  date.setDate(date.getDate() + bidDuration);

  console.log("aaa", Math.floor(date.getTime() / 1000).toString());
  console.log("aaa", price, setModalText);

  await contract.methods
    .mint(
      status,
      Web3.utils.toWei(price),
      Math.floor(date.getTime() / 1000).toString(),
      tokenURI
    )
    .send({
      from: address,
    })
    .on("transactionHash", (hash) => {
      // console.log("hash 0", hash);
    })
    .on("confirmation", function (confirmationNumber, receipt) {
      if (confirmationNumber === 1) {
        setModalText("Verifying Post...");
      }
      if (confirmationNumber === 2) {
        setModalText("Listing Post...");
      }
      if (confirmationNumber === 3) {
        cb();
      }
    });
};

export const updateAccount = async (
  args: any[],
  address: string,
  contract: any,
  cb: () => void
) => {
  await contract.methods
    .updateUserInfo(args)
    .send({
      from: address,
    })
    .on("transactionHash", (hash) => {
      // console.log("hash 0", hash);
    })
    .on("confirmation", function (confirmationNumber, receipt) {
      if (confirmationNumber === 1) {
        cb();
        // tx confirmed
        // console.log("tx confirmed");
      }
    });
};
