import type { IR } from "../ir/types.js";
import {
  validateIR,
  validateSchemaLayer,
  validateTemplateLayer,
  type ValidationResult,
} from "../validation/validator.js";
import { getContractType } from "../registry/contractTypes.js";

export function validateIntermediateRepresentation(ir: IR): ValidationResult {
  return validateIR(ir);
}

export function validateSchemaForIR(ir: IR) {
  const { schema } = getContractType(ir.contractType);
  return validateSchemaLayer(ir, schema);
}

export function validateTemplateForIR(ir: IR) {
  return validateTemplateLayer(ir);
}

