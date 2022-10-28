type ChainChangeRequestType = (
  chainId: string,
  cb: () => void,
) => Promise<void>;
type AddChainToMetamaskType = (
  chainData: ChainData,
  cb: () => void,
) => Promise<void>;

interface ChainData {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
}

export const chainChangeRequest: ChainChangeRequestType = async (
  chainId,
  cb,
) => {
  function addChainData(chainData: ChainData) {
    try {
      (window as any).ethereum
        .request({
          method: 'eth_requestAccounts',
        })
        .then(function () {
          (window as any).ethereum
            .request({
              method: 'wallet_switchEthereumChain',
              params: [
                {
                  chainId,
                },
              ],
            })
            .then(() => {
              cb();
            })
            .catch((error: any) => {
              if (error.code === 4902) {
                addChainToMetamask(chainData, cb);
              }
            });
        })
        .catch((error: any) => {
          console.log(error);
        });
    } catch (error) {
      console.log('Caught => ', error);
    }
  }

  if (chainId === '0x89') {
    const chainData: ChainData = {
      chainId: '0x89',
      chainName: 'Polygon',
      rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      blockExplorerUrls: ['https://polygonscan.com/'],
    };

    addChainData(chainData);
  } else if (chainId === '0x13881') {
    const chainData: ChainData = {
      chainId: '0x13881',
      chainName: 'Mumbai',
      rpcUrls: [
        'https://polygon-mumbai.g.alchemy.com/v2/5MfjmScw7iPoX389ZCYuKOtgtsA1Eg4g',
      ],
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    };

    addChainData(chainData);
  }
};
export const addChainToMetamask: AddChainToMetamaskType = async (
  chainData,
  cb,
) => {
  try {
    (window as any).ethereum
      .request({
        method: 'eth_requestAccounts',
      })
      .then(function () {
        (window as any).ethereum
          .request({
            method: 'wallet_addEthereumChain',
            params: [chainData],
          })
          .then(() => {
            cb();
          });
      });
  } catch (error) {
    console.log(error);
  }
};
