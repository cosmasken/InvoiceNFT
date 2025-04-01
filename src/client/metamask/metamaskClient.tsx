import { ContractId } from "@hashgraph/sdk";
import { ethers } from "ethers";
import { useContext, useEffect } from "react";
import { MetamaskContext } from "../../contexts/MetamaskContext";
import { ContractFunctionParameterBuilder } from "../contractFunctionParameterBuilder";

 const METAMASK_GAS_LIMIT_ASSOCIATE=800_000;
 const METAMASK_GAS_LIMIT_TRANSFER_FT=50_000;
 const METAMASK_GAS_LIMIT_TRANSFER_NFT=100_000;

const networkConfig = {
  testnet: {
    network: "testnet",
    jsonRpcUrl: "https://testnet.hashio.io/api", // check out the readme for alternative RPC Relay urls
    mirrorNodeUrl: "https://testnet.mirrornode.hedera.com",
    chainId: "0x128",
  },
};

const currentNetworkConfig = networkConfig.testnet;

declare global {
  interface Window {
    ethereum?: any; // Use a more specific type if available (e.g., from `@metamask/providers`)
  }
}

const { ethereum } = window;

const getProvider = (): ethers.providers.Web3Provider => {
  if (!ethereum) {
    throw new Error("Metamask is not installed! Go install the extension!");
  }

  return new ethers.providers.Web3Provider(ethereum);
};

export const switchToHederaNetwork = async (ethereum: any): Promise<void> => {
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: currentNetworkConfig.chainId }], // chainId must be in hexadecimal numbers
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainName: `Hedera (${currentNetworkConfig.network})`,
              chainId: currentNetworkConfig.chainId,
              nativeCurrency: {
                name: "HBAR",
                symbol: "HBAR",
                decimals: 18,
              },
              rpcUrls: [currentNetworkConfig.jsonRpcUrl],
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
      }
    }
    console.error(error);
  }
};

// Returns a list of accounts or an empty array
export const connectToMetamask = async (): Promise<string[]> => {
  const provider = getProvider();

  let accounts: string[] = [];

  try {
    await switchToHederaNetwork(ethereum);
    accounts = await provider.send("eth_requestAccounts", []);
  } catch (error: any) {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.warn("Please connect to Metamask.");
    } else {
      console.error(error);
    }
  }

  return accounts;
};

class MetaMaskWallet {
  convertAccountIdToSolidityAddress(accountId: any): string {
    const accountIdString =
      accountId.evmAddress !== null
        ? accountId.evmAddress.toString()
        : accountId.toSolidityAddress();

    return `0x${accountIdString}`;
  }

  // Purpose: Transfer HBAR
  // Returns: Promise<string | null>
  async transferHBAR(toAddress: string, amount: number): Promise<string | null> {
    const provider = getProvider();
    const signer = await provider.getSigner();
    const tx = await signer.populateTransaction({
      to: this.convertAccountIdToSolidityAddress(toAddress),
      value: ethers.utils.parseEther(amount.toString()),
    });

    try {
      const { hash } = await signer.sendTransaction(tx);
      await provider.waitForTransaction(hash);

      return hash;
    } catch (error: any) {
      console.warn(error.message ? error.message : error);
      return null;
    }
  }

  async transferFungibleToken(
    toAddress: string,
    tokenId: string,
    amount: number
  ): Promise<string | null> {
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      "transfer",
      new ContractFunctionParameterBuilder()
        .addParam({
          type: "address",
          name: "recipient",
          value: this.convertAccountIdToSolidityAddress(toAddress),
        })
        .addParam({
          type: "uint256",
          name: "amount",
          value: amount,
        }),
      METAMASK_GAS_LIMIT_TRANSFER_FT
    );

    return hash;
  }

  async transferNonFungibleToken(
    toAddress: string,
    tokenId: string,
    serialNumber: number
  ): Promise<string | null> {
    const provider = getProvider();
    const addresses = await provider.listAccounts();
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      "transferFrom",
      new ContractFunctionParameterBuilder()
        .addParam({
          type: "address",
          name: "from",
          value: addresses[0],
        })
        .addParam({
          type: "address",
          name: "to",
          value: this.convertAccountIdToSolidityAddress(toAddress),
        })
        .addParam({
          type: "uint256",
          name: "nftId",
          value: serialNumber,
        }),
      METAMASK_GAS_LIMIT_TRANSFER_NFT
    );

    return hash;
  }

  async associateToken(tokenId: string): Promise<string | null> {
    const hash = await this.executeContractFunction(
      ContractId.fromString(tokenId.toString()),
      "associate",
      new ContractFunctionParameterBuilder(),
      METAMASK_GAS_LIMIT_ASSOCIATE
    );

    return hash;
  }

  async executeContractFunction(
    contractId: ContractId,
    functionName: string,
    functionParameters: ContractFunctionParameterBuilder,
    gasLimit: number
  ): Promise<string | null> {
    const provider = getProvider();
    const signer = await provider.getSigner();
    const abi = [
      `function ${functionName}(${functionParameters.buildAbiFunctionParams()})`,
    ];

    const contract = new ethers.Contract(
      `0x${contractId.toSolidityAddress()}`,
      abi,
      signer
    );

    try {
      const txResult = await contract[functionName](
        ...functionParameters.buildEthersParams(),
        {
          gasLimit: gasLimit === -1 ? undefined : gasLimit,
        }
      );
      return txResult.hash;
    } catch (error: Error) {
      console.warn(error.message ? error.message : error);
      return null;
    }
  }

  disconnect(): void {
    alert("Please disconnect using the Metamask extension.");
  }
}

export const metamaskWallet = new MetaMaskWallet();

export const MetaMaskClient = (): null => {
  const { setMetamaskAccountAddress } = useContext(MetamaskContext);

  useEffect(() => {
    try {
      const provider = getProvider();
      provider.listAccounts().then((signers: string[]) => {
        if (signers.length !== 0) {
          setMetamaskAccountAddress(signers[0]);
        } else {
          setMetamaskAccountAddress("");
        }
      });

      ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length !== 0) {
          setMetamaskAccountAddress(accounts[0]);
        } else {
          setMetamaskAccountAddress("");
        }
      });

      return () => {
        ethereum.removeAllListeners("accountsChanged");
      };
    } catch (error: any) {
      console.error(error.message ? error.message : error);
    }
  }, [setMetamaskAccountAddress]);

  return null;
};