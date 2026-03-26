import {
  getContractType,
  listContractTypes,
  type ContractTypeEntry,
} from "../registry/contractTypes.js";

export function loadContractType(contractType: string): ContractTypeEntry {
  return getContractType(contractType);
}

export function loadKnownContractTypes(): string[] {
  return listContractTypes();
}

