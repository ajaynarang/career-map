import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { CareerMeta, CountryOverview, UniversityMeta, ExamMeta } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readMdxFile<T>(filePath: string): { data: T; content: string } | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data: data as T, content };
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => f.replace(".mdx", ""));
}

export function getAllCareerSlugs(): string[] {
  const careersDir = path.join(CONTENT_DIR, "careers");
  if (!fs.existsSync(careersDir)) return [];
  return fs
    .readdirSync(careersDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function getCareerMeta(careerSlug: string): { data: CareerMeta; content: string } | null {
  return readMdxFile<CareerMeta>(
    path.join(CONTENT_DIR, "careers", careerSlug, "_meta.mdx")
  );
}

export function getAllCareerMetas(): { data: CareerMeta; content: string }[] {
  return getAllCareerSlugs()
    .map(getCareerMeta)
    .filter((c): c is NonNullable<typeof c> => c !== null);
}

export function getCountryOverview(
  careerSlug: string,
  countrySlug: string
): { data: CountryOverview; content: string } | null {
  return readMdxFile<CountryOverview>(
    path.join(CONTENT_DIR, "careers", careerSlug, countrySlug, "_overview.mdx")
  );
}

export function getCountrySlugs(careerSlug: string): string[] {
  const careerDir = path.join(CONTENT_DIR, "careers", careerSlug);
  if (!fs.existsSync(careerDir)) return [];
  return fs
    .readdirSync(careerDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export function getUniversity(
  careerSlug: string,
  countrySlug: string,
  uniSlug: string
): { data: UniversityMeta; content: string } | null {
  return readMdxFile<UniversityMeta>(
    path.join(CONTENT_DIR, "careers", careerSlug, countrySlug, `${uniSlug}.mdx`)
  );
}

export function listUniversities(
  careerSlug: string,
  countrySlug: string
): string[] {
  return listMdxFiles(
    path.join(CONTENT_DIR, "careers", careerSlug, countrySlug)
  );
}

export function getAllUniversityMetas(
  careerSlug: string,
  countrySlug: string
): { data: UniversityMeta; content: string }[] {
  return listUniversities(careerSlug, countrySlug)
    .map((slug) => getUniversity(careerSlug, countrySlug, slug))
    .filter((u): u is NonNullable<typeof u> => u !== null);
}

export function getExam(examSlug: string): { data: ExamMeta; content: string } | null {
  return readMdxFile<ExamMeta>(
    path.join(CONTENT_DIR, "exams", `${examSlug}.mdx`)
  );
}

export function getAllExamSlugs(): string[] {
  return listMdxFiles(path.join(CONTENT_DIR, "exams"));
}

export function getExamsForCareerCountry(
  careerSlug: string,
  countrySlug: string
): { data: ExamMeta; content: string }[] {
  const meta = getCareerMeta(careerSlug);
  if (!meta) return [];
  const examSlugs = meta.data.exams[countrySlug] || [];
  return examSlugs
    .map(getExam)
    .filter((e): e is NonNullable<typeof e> => e !== null);
}

export function getActionPlan(
  careerSlug: string
): { data: { title: string }; content: string } | null {
  return readMdxFile<{ title: string }>(
    path.join(CONTENT_DIR, "careers", careerSlug, "_action-plan.mdx")
  );
}

export function generateAllCareerCountryParams(): { career: string; country: string }[] {
  const params: { career: string; country: string }[] = [];
  for (const careerSlug of getAllCareerSlugs()) {
    for (const countrySlug of getCountrySlugs(careerSlug)) {
      params.push({ career: careerSlug, country: countrySlug });
    }
  }
  return params;
}

export function generateAllUniversityParams(): { career: string; country: string; university: string }[] {
  const params: { career: string; country: string; university: string }[] = [];
  for (const careerSlug of getAllCareerSlugs()) {
    for (const countrySlug of getCountrySlugs(careerSlug)) {
      for (const uniSlug of listUniversities(careerSlug, countrySlug)) {
        params.push({ career: careerSlug, country: countrySlug, university: uniSlug });
      }
    }
  }
  return params;
}
