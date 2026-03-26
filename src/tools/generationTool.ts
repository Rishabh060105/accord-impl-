import type { IR } from "../ir/types.js";
import {
  generateArtifacts,
  generateGrammarTemMd,
  generateLogicErgo,
  generateModelCto,
  type GeneratedArtifacts,
} from "../generation/generator.js";

export function generateAccordArtifacts(ir: IR): GeneratedArtifacts {
  return generateArtifacts(ir);
}

export function generateConcertoModel(ir: IR): string {
  return generateModelCto(ir);
}

export function generateTemplateGrammar(ir: IR): string {
  return generateGrammarTemMd(ir);
}

export function generateErgoLogic(ir: IR): string {
  return generateLogicErgo(ir);
}

