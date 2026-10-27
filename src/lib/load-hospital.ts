import fs from "fs";
import path from "path";
import type { HospitalPage } from "@/types/sections";

export function getHospitalBySlug(slug: string): HospitalPage | null {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "hospitals", `${slug}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData) as HospitalPage;
  } catch {
    return null;
  }
}

export function getHospitalSlugs(): string[] {
  try {
    const hospitalsDir = path.join(process.cwd(), "src", "data", "hospitals");
    return fs
      .readdirSync(hospitalsDir)
      .filter((filename) => filename.endsWith(".json") && !filename.startsWith("_"))
      .map((filename) => filename.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}
