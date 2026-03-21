import { CareerDataMap } from "@/lib/types";
import { engineering } from "./engineering";
import { science } from "./science";
import { finance } from "./finance";
import { design } from "./design";
import { defence } from "./defence";

// ─── Add new career paths here ───
// 1. Create a new file in src/data/ (e.g., arts.ts)
// 2. Import it above
// 3. Add it to the map below

export const CAREER_DATA: CareerDataMap = {
  eng: engineering,
  sci: science,
  fin: finance,
  des: design,
  def: defence,
};
