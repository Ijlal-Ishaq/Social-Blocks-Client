import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1313161555],  //aurora testnet (1313161555)
});

//@ts-ignore
export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213",
    4: "https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213",
    80001: "https://rpc-mumbai.maticvigil.com/",
    1313161555: "https://testnet.aurora.dev",
  },
  // infuraId: INFURA_TOKEN,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  //@ts-ignore
  pollingInterval: 15000,
});
