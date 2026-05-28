import { Department } from "@/types/enums";

export interface DepartmentMeta {
  value: string;
  label: string;
  shortLabel: string;
}

export const DEPARTMENTS: DepartmentMeta[] = [
  { value: Department.CSE,   label: "Computer Science & Engineering",          shortLabel: "CSE" },
  { value: Department.ECE,   label: "Electronics & Communication Engineering", shortLabel: "ECE" },
  { value: Department.ME,    label: "Mechanical Engineering",                  shortLabel: "ME" },
  { value: Department.CE,    label: "Civil Engineering",                       shortLabel: "CE" },
  { value: Department.EEE,   label: "Electrical & Electronics Engineering",    shortLabel: "EEE" },
  { value: Department.IT,    label: "Information Technology",                  shortLabel: "IT" },
  { value: Department.CHEM,  label: "Chemical Engineering",                    shortLabel: "CHEM" },
  { value: Department.BIO,   label: "Biotechnology",                           shortLabel: "BIO" },
  { value: Department.MBA,   label: "Business Administration",                 shortLabel: "MBA" },
  { value: Department.MCA,   label: "Master of Computer Applications",         shortLabel: "MCA" },
  { value: Department.MTECH, label: "M.Tech",                                  shortLabel: "M.Tech" },
  { value: Department.PHD,   label: "PhD / Research",                          shortLabel: "PhD" },
  { value: Department.OTHER, label: "Other",                                   shortLabel: "Other" },
];

/** For use in <select> dropdowns */
export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((d) => ({
  value: d.value,
  label: d.label,
}));
