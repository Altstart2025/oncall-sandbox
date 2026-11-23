import assert from "node:assert/strict";
import { test } from "node:test";
import { ContractError, validateAdvisory } from "../src/contract.js";

const v2 = { id: "ADV-1001", region: "EU-EAST", risk_level: "elevated", alt_band: "FL200-FL300", issued_at: "2026-11-20T10:00:00Z" };

test("a v2 advisory passes the contract", () => {
  assert.deepEqual(validateAdvisory(v2), v2);
});

test("an advisory without risk_level is rejected", () => {
  const { risk_level, ...rest } = v2;
  assert.throws(() => validateAdvisory(rest), ContractError);
});

test("an advisory without alt_band is rejected", () => {
  const { alt_band, ...rest } = v2;
  assert.throws(() => validateAdvisory(rest), ContractError);
});
