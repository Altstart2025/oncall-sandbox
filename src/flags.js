// The mitigation switch: GrowthBook flag `advisory-data-delayed`. Off when no key is set.
import { GrowthBook } from "@growthbook/growthbook";

export const DELAYED_FLAG = "advisory-data-delayed";

export async function isDataDelayed() {
  const clientKey = process.env.GB_CLIENT_KEY;
  if (!clientKey) return false;
  const gb = new GrowthBook({ apiHost: process.env.GB_API_HOST ?? "https://cdn.growthbook.io", clientKey });
  try {
    await gb.init({ timeout: 2000 });
    return gb.isOn(DELAYED_FLAG);
  } finally {
    gb.destroy();
  }
}
