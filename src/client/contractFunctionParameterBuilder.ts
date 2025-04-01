// Reason: We need to build HAPI contract functions params
// And we want the string contract function params that ethers expects
// This is an opportunity for the adapter pattern.

import { ContractFunctionParameters } from "@hashgraph/sdk";

// Define the type for a single parameter
interface ContractFunctionParam {
  type: string; // The type of the parameter (e.g., "uint256", "address")
  name: string; // The name of the parameter
  value: any; // The value of the parameter
}

export class ContractFunctionParameterBuilder {
  private params: ContractFunctionParam[];

  constructor() {
    this.params = [];
  }

  // Add a parameter to the list
  addParam(param: ContractFunctionParam): this {
    this.params.push(param);
    return this;
  }

  // Purpose: Build the ABI function parameters
  // Reason: The ABI function parameters are required to construct the ethers.Contract object for calling a contract function using ethers
  buildAbiFunctionParams(): string {
    return this.params.map(param => `${param.type} ${param.name}`).join(", ");
  }

  // Purpose: Build the ethers-compatible contract function call params
  // Reason: An array of strings is required to call a contract function using ethers
  buildEthersParams(): string[] {
    return this.params.map(param => param.value.toString());
  }

  // Purpose: Build the HAPI-compatible contract function params
  // Reason: An instance of ContractFunctionParameters is required to call a contract function using Hedera wallets
  buildHAPIParams(): ContractFunctionParameters {
    const contractFunctionParams = new ContractFunctionParameters();

    for (const param of this.params) {
      // Ensure type only contains alphanumeric characters (no spaces, no special characters, no whitespace), and does not start with a number
      const alphanumericIdentifier = /^[a-zA-Z][a-zA-Z0-9]*$/;
      if (!param.type.match(alphanumericIdentifier)) {
        throw new Error(
          `Invalid type: ${param.type}. Type must only contain alphanumeric characters.`
        );
      }

      // Capitalize the first letter of the type
      const type = param.type.charAt(0).toUpperCase() + param.type.slice(1);
      const functionName = `add${type}`;

      // Check if the function exists in ContractFunctionParameters
      if (functionName in contractFunctionParams) {
        (contractFunctionParams as any)[functionName](param.value);
      } else {
        throw new Error(
          `Invalid type: ${param.type}. Could not find function ${functionName} in ContractFunctionParameters class.`
        );
      }
    }

    return contractFunctionParams;
  }
}