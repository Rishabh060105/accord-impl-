/**
 * Agentic Workflow Test Runner
 * ----------------------------
 * Verifies the TypeScript agentic orchestration layer using the MockProvider.
 *
 * Usage: node --loader ts-node/esm src/tests/agenticRunner.ts
 */

import { MockProvider } from "../llm/providers/MockProvider.js";
import { AgenticWorkflowOrchestrator } from "../workflow/orchestrator.js";

interface AgenticTestCase {
  id: string;
  input: string;
  expectedContractType: string;
}

const CASES: AgenticTestCase[] = [
  {
    id: "service-agreement-agentic",
    input: "Draft a service agreement between DevCo and ClientCorp with milestone payments.",
    expectedContractType: "ServiceAgreement",
  },
  {
    id: "late-penalty-agentic",
    input: "Create a late penalty clause with a weekly penalty and a grace period.",
    expectedContractType: "LatePenalty",
  },
];

async function runCase(testCase: AgenticTestCase): Promise<{ passed: boolean; notes: string[] }> {
  const orchestrator = new AgenticWorkflowOrchestrator(new MockProvider(), {
    verbose: false,
    maxRepairPasses: 2,
  });

  const result = await orchestrator.run(testCase.input);
  const notes: string[] = [];

  if (!result.success) {
    notes.push(`Workflow failed: ${result.errorSummary ?? "unknown error"}`);
  }

  if (result.context.selectedContractType !== testCase.expectedContractType) {
    notes.push(
      `Expected contract type ${testCase.expectedContractType}, got ${String(result.context.selectedContractType)}`
    );
  }

  if (!result.context.artifacts) {
    notes.push("Artifacts were not generated");
  }

  if (!result.context.reviewNotes) {
    notes.push("Review notes were not generated");
  }

  return {
    passed: notes.length === 0,
    notes,
  };
}

async function main(): Promise<void> {
  console.log("\nAccord Agentic Workflow — Test Run");
  console.log("Provider: MockProvider");
  console.log(`Cases    : ${CASES.length}`);
  console.log("─────────────────────────────────────────────────────");

  let passed = 0;

  for (const testCase of CASES) {
    const result = await runCase(testCase);
    process.stdout.write(result.passed ? "." : "F");

    if (result.passed) {
      passed++;
    } else {
      console.log(`\n[${testCase.id}]`);
      result.notes.forEach((note) => console.log(`  - ${note}`));
    }
  }

  console.log("");
  console.log(`Passed ${passed}/${CASES.length} agentic workflow cases.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

