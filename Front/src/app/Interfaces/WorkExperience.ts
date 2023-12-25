export interface WorkExperience {
  id?: number | null;
  company?: string | null;
  country?: string | null;
  job?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  functions?: string | null;
  state?: number; // Estado inicial 1
}

