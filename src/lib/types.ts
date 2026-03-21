// ─── Career Types ───

export interface CareerMeta {
  title: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  whyChoose: string;
  countries: string[];
  exams: Record<string, string[]>;
}

// ─── Country Overview Types ───

export interface CountryOverview {
  country: string;
  countryCode: string;
  career: string;
  overview: string;
  budget: {
    tuition: string;
    living: string;
    total4yr: string;
    totalInr: string;
  };
  language: string;
  workWhileStudying: string;
  postStudyVisa: string;
  safety: string;
}

// ─── University Types ───

export interface UniversityMeta {
  name: string;
  slug: string;
  location: string;
  ranking: string;
  fees: {
    tuition: string;
    total: string;
    inr: string;
  };
  placements: {
    average: string;
    inr: string;
  };
  topRecruiters: string[];
  programs: string[];
  acceptance: string;
  requirements: {
    exam: string;
    grades: string;
    extras: string;
  };
  scholarships: string[];
  website: string;
  applyLink: string;
}

// ─── Exam Types ───

export interface ExamMeta {
  name: string;
  slug: string;
  when: string;
  registration: {
    website: string;
    fee: string;
    deadline: string;
  };
  eligibility: string;
  format: {
    questions: number;
    marks: number;
    duration: string;
    details: string;
  };
  syllabus: string;
  careers: string[];
}

// ─── Action Plan Types ───

export interface ActionPlanItem {
  text: string;
  countries: string[];
}

export interface ActionPhase {
  phase: string;
  items: ActionPlanItem[];
}

export interface ActionPlan {
  title: string;
  phases: ActionPhase[];
}

// ─── Theme ───

export interface CareerTheme {
  color: string;
  icon: string;
}
