// 应用程序状态类型
export type ApplicationStatus = 
  | 'not_started' 
  | 'in_progress' 
  | 'submitted' 
  | 'under_review' 
  | 'decided';

// 申请类型
export type ApplicationType = 
  | 'early_decision' 
  | 'early_action' 
  | 'regular_decision' 
  | 'rolling_admission';

// 决定类型
export type DecisionType = 'accepted' | 'rejected' | 'waitlisted';

// 要求状态
export type RequirementStatus = 'not_started' | 'in_progress' | 'completed';

// 大学类型
export interface University {
  id: string;
  name: string;
  country: string;
  state?: string;
  city: string;
  ranking?: number;
  acceptanceRate?: number;
  applicationSystem?: string;
  tuitionInState?: number;
  tuitionOutState?: number;
  applicationFee?: number;
  deadlines?: Record<string, string>;
  majorsOffered?: string[];
  description?: string;
  website?: string;
  logoUrl?: string;
}

// 申请要求类型
export interface ApplicationRequirement {
  id: string;
  requirementType: string;
  status: RequirementStatus;
  deadline?: string;
  notes?: string;
}

// 申请类型
export interface Application {
  id: string;
  university: University;
  universityId: string;
  applicationType: ApplicationType;
  deadline: string;
  status: ApplicationStatus;
  createdAt?: string;
  decisionDate?: string;
  decisionType?: DecisionType;
  notes?: string;
  program: string;
  requirements: ApplicationRequirement[];
}

// 截止日期类型
export interface Deadline {
  id: string;
  date: string;
  universityName: string;
  universityId: string;
  applicationId: string;
  type: string;
  status: ApplicationStatus;
}

// 学生类型
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  graduationYear: number;
  gpa?: number;
  satScore?: number;
  actScore?: number;
  targetCountries: string[];
  intendedMajors: string[];
  profileImageUrl?: string;
}