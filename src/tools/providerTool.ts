import type { IR, IRFields } from "../ir/types.js";
import type { LLMProvider, ValidationError } from "../llm/interface.js";
import type { ContractSchema } from "../registry/contractTypes.js";

export async function identifyContractTypeWithProvider(
  provider: LLMProvider,
  contractText: string,
  knownTypes: string[]
): Promise<string | null> {
  return provider.identifyContractType(contractText, knownTypes);
}

export async function extractIRWithProvider(
  provider: LLMProvider,
  contractText: string,
  schema: ContractSchema
): Promise<IRFields> {
  return provider.extractIR(contractText, schema);
}

export async function repairIRWithProvider(
  provider: LLMProvider,
  contractText: string,
  errors: ValidationError[],
  currentIR: IR
): Promise<IRFields> {
  return provider.repairIR(contractText, errors, currentIR);
}

