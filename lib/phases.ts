// Phases are called zones on the site. The one place their names live.

export const PHASE_NAMES: Record<number, string> = {
  1: "Foundations",
  2: "Retrieval",
  3: "Workflows",
  4: "Evals",
  5: "Agents",
  6: "Production",
  7: "Beyond text",
};

export const PHASES = Object.keys(PHASE_NAMES).map(Number);

export const zoneLabel = (phase: number) => `Zone ${phase} · ${PHASE_NAMES[phase]}`;

export const zoneHref = (phase: number) => (phase === 1 ? "/" : `/zone/${phase}`);
