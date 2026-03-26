import type { GeneratedArtifacts } from "../generation/generator.js";
import type { IR } from "../ir/types.js";
import type { ValidationError } from "../llm/interface.js";
import type { ValidationResult } from "../validation/validator.js";

export type WorkflowStage =
  | "requirements_analysis"
  | "contract_type_classification"
  | "schema_alignment"
  | "ir_composition"
  | "validation"
  | "repair"
  | "artifact_generation"
  | "review";

export type WorkflowStatus = "pending" | "running" | "repairing" | "completed" | "failed";

export interface StageTrace {
  stage: WorkflowStage | "heuristic";
  summary: string;
  startedAt: string;
  finishedAt?: string;
}

export interface RepairRecord {
  iteration: number;
  errorsBefore: ValidationError[];
  errorsAfter: ValidationError[];
}

export interface WorkflowContext {
  rawRequirements: string;
  normalizedBrief: string | null;
  selectedContractType: string | null;
  schemaNamespace: string | null;
  extractedIR: IR | null;
  repairedIR: IR | null;
  validationResult: ValidationResult | null;
  artifacts: GeneratedArtifacts | null;
  reviewNotes: string | null;
  status: WorkflowStatus;
  maxRepairPasses: number;
  repairPassesUsed: number;
  repairHistory: RepairRecord[];
  traces: StageTrace[];
  errors: string[];
}

export function createWorkflowContext(
  rawRequirements: string,
  options: { maxRepairPasses?: number } = {}
): WorkflowContext {
  return {
    rawRequirements,
    normalizedBrief: null,
    selectedContractType: null,
    schemaNamespace: null,
    extractedIR: null,
    repairedIR: null,
    validationResult: null,
    artifacts: null,
    reviewNotes: null,
    status: "pending",
    maxRepairPasses: options.maxRepairPasses ?? 3,
    repairPassesUsed: 0,
    repairHistory: [],
    traces: [],
    errors: [],
  };
}

export function getActiveIR(context: WorkflowContext): IR | null {
  return context.repairedIR ?? context.extractedIR;
}

export function addStageTrace(
  context: WorkflowContext,
  trace: StageTrace
): WorkflowContext {
  context.traces.push(trace);
  return context;
}

export function addRepairRecord(
  context: WorkflowContext,
  record: RepairRecord
): WorkflowContext {
  context.repairHistory.push(record);
  context.repairPassesUsed = record.iteration;
  return context;
}

