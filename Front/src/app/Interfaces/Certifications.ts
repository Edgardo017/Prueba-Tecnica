export interface Certifications {
    id?: number;
    type: string | null;
    institution: string | null;
    career: string | null;
    semester: string | null;
    startYear: Date | null;
    endYear: Date | null;
    studyState: string | null;
    state: number | null;
}