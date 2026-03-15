export interface ContactInfo {
  name: string
  email: string
  phone: string
  linkedin?: string
  location?: string
  website?: string
}

export interface ExperienceEntry {
  title: string
  company: string
  dates: string
  location?: string
  bullets: string[]
}

export interface EducationEntry {
  degree: string
  institution: string
  dates: string
  location?: string
  details?: string
}

export interface CertificationEntry {
  name: string
  issuer?: string
  date?: string
}

export interface RewrittenCV {
  contact: ContactInfo
  summary: string
  experience: ExperienceEntry[]
  skills: string[]
  education: EducationEntry[]
  certifications?: CertificationEntry[]
  atsScore: number
  keywordsAdded: string[]
  keywordsMissing: string[]
  improvementTips?: string[]
}

export interface RewriteResult {
  success: boolean
  cv?: RewrittenCV
  error?: string
  docxBase64?: string
}
