import type { WorkflowStage } from "../workflow/context.js";

export interface SpecialistAgentDefinition {
  id:
    | "requirements_analyst"
    | "template_classifier"
    | "schema_alignment_agent"
    | "ir_composer"
    | "validation_auditor"
    | "repair_specialist"
    | "artifact_builder"
    | "review_agent";
  name: string;
  stage: WorkflowStage;
  role: string;
  goal: string;
  inputs: string[];
  outputs: string[];
}

export const SPECIALIST_AGENTS: SpecialistAgentDefinition[] = [
  {
    id: "requirements_analyst",
    name: "Requirements Analyst",
    stage: "requirements_analysis",
    role: "Normalize natural-language template requirements into a structured brief.",
    goal: "Extract parties, obligations, key terms, assumptions, and drafting intent.",
    inputs: ["rawRequirements"],
    outputs: ["normalizedBrief"],
  },
  {
    id: "template_classifier",
    name: "Template Classifier",
    stage: "contract_type_classification",
    role: "Choose the best supported contract or template family.",
    goal: "Map the brief to a known schema family before extraction begins.",
    inputs: ["normalizedBrief"],
    outputs: ["selectedContractType"],
  },
  {
    id: "schema_alignment_agent",
    name: "Schema Alignment Agent",
    stage: "schema_alignment",
    role: "Load the registry schema and align the requirement with supported fields.",
    goal: "Constrain extraction to valid, schema-bound fields and template rules.",
    inputs: ["normalizedBrief", "selectedContractType"],
    outputs: ["schemaNamespace"],
  },
  {
    id: "ir_composer",
    name: "IR Composer",
    stage: "ir_composition",
    role: "Build the typed intermediate representation.",
    goal: "Fill only supported fields and preserve ambiguity where needed.",
    inputs: ["rawRequirements", "selectedContractType", "schemaNamespace"],
    outputs: ["extractedIR"],
  },
  {
    id: "validation_auditor",
    name: "Validation Auditor",
    stage: "validation",
    role: "Validate the IR against schema, template, and business rules.",
    goal: "Catch missing fields, wrong types, enum violations, and structural mismatches.",
    inputs: ["extractedIR"],
    outputs: ["validationResult"],
  },
  {
    id: "repair_specialist",
    name: "Repair Specialist",
    stage: "repair",
    role: "Repair invalid IR fields using targeted validation feedback.",
    goal: "Apply minimal corrections and feed the result back into validation.",
    inputs: ["rawRequirements", "extractedIR", "validationResult"],
    outputs: ["repairedIR", "repairHistory"],
  },
  {
    id: "artifact_builder",
    name: "Artifact Builder",
    stage: "artifact_generation",
    role: "Generate Accord-compatible template artifacts deterministically.",
    goal: "Produce model, grammar, logic, and metadata from a valid IR.",
    inputs: ["extractedIR", "repairedIR"],
    outputs: ["artifacts"],
  },
  {
    id: "review_agent",
    name: "Review Agent",
    stage: "review",
    role: "Explain what was generated and highlight warnings or assumptions.",
    goal: "Make the workflow transparent and easier to review.",
    inputs: ["artifacts", "validationResult", "repairHistory"],
    outputs: ["reviewNotes"],
  },
];

export function getSpecialistAgent(
  id: SpecialistAgentDefinition["id"]
): SpecialistAgentDefinition {
  const agent = SPECIALIST_AGENTS.find((entry) => entry.id === id);
  if (!agent) {
    throw new Error(`Unknown specialist agent "${id}"`);
  }
  return agent;
}

