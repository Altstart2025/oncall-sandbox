// The v2 advisory contract. A record that does not match is rejected (fail closed).
export const RISK_LEVELS = new Set(["low", "elevated", "high"]);

export class ContractError extends Error {
  constructor(message) {
    super(message);
    this.name = "ContractError";
  }
}

export function validateAdvisory(advisory) {
  if (typeof advisory?.id !== "string") throw new ContractError("id missing");
  if (!RISK_LEVELS.has(advisory.risk_level)) {
    throw new ContractError(`risk_level missing or invalid on ${advisory.id}`);
  }
  if (typeof advisory.alt_band !== "string") throw new ContractError(`alt_band missing on ${advisory.id}`);
  return advisory;
}
