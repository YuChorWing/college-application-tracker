import { Application, University, ApplicationStatus, ApplicationType } from '@/types';

// 大学数据
const universities: University[] = [
  {
    id: 'uni_001',
    name: 'Stanford University',
    country: 'USA',
    state: 'California',
    city: 'Stanford',
    ranking: 3,
    logoUrl: 'https://picsum.photos/id/101/200/200',
    website: 'https://www.stanford.edu'
  },
  {
    id: 'uni_002',
    name: 'Massachusetts Institute of Technology (MIT)',
    country: 'USA',
    state: 'Massachusetts',
    city: 'Cambridge',
    ranking: 1,
    logoUrl: 'https://picsum.photos/id/102/200/200',
    website: 'https://web.mit.edu'
  },
  {
    id: 'uni_003',
    name: 'University of California, Berkeley',
    country: 'USA',
    state: 'California',
    city: 'Berkeley',
    ranking: 5,
    logoUrl: 'https://picsum.photos/id/103/200/200',
    website: 'https://www.berkeley.edu'
  },
  {
    id: 'uni_004',
    name: 'Carnegie Mellon University',
    country: 'USA',
    state: 'Pennsylvania',
    city: 'Pittsburgh',
    ranking: 22,
    logoUrl: 'https://picsum.photos/id/104/200/200',
    website: 'https://www.cmu.edu'
  },
  {
    id: 'uni_005',
    name: 'University of Chicago',
    country: 'USA',
    state: 'Illinois',
    city: 'Chicago',
    ranking: 10,
    logoUrl: 'https://picsum.photos/id/105/200/200',
    website: 'https://www.uchicago.edu'
  }
];

// 学生仪表板完整模拟数据
export const mockStudentDashboardData = {
  student: {
    id: 'stu_12345',
    first_name: 'Alex',
    profile_image_url: 'https://picsum.photos/id/64/200/200'
  },

  applications: [
    {
      id: 'app_001',
      university: universities[0], // Stanford University
      program: 'Computer Science',
      status: 'submitted' as ApplicationStatus,
      deadline: '2023-12-15T00:00:00.000Z',
      createdAt: '2023-09-01T00:00:00.000Z',
      notes: 'Submitted with 3 recommendation letters',
      applicationType: 'early_decision' as ApplicationType
    },
    {
      id: 'app_002',
      university: universities[1], // MIT
      program: 'Electrical Engineering',
      status: 'in_progress' as ApplicationStatus,
      deadline: '2023-11-30T00:00:00.000Z',
      createdAt: '2023-09-10T00:00:00.000Z',
      notes: 'Need to finish personal statement',
      applicationType: 'early_action' as ApplicationType
    },
    {
      id: 'app_003',
      university: universities[2], // UC Berkeley
      program: 'Mechanical Engineering',
      status: 'under_review' as ApplicationStatus,
      deadline: '2023-11-15T00:00:00.000Z',
      createdAt: '2023-08-20T00:00:00.000Z',
      applicationType: 'regular_decision' as ApplicationType
    },
    {
      id: 'app_004',
      university: universities[3], // Carnegie Mellon
      program: 'Artificial Intelligence',
      status: 'not_started' as ApplicationStatus,
      deadline: '2024-01-10T00:00:00.000Z',
      createdAt: '2023-09-15T00:00:00.000Z',
      applicationType: 'rolling_admission' as ApplicationType
    },
    {
      id: 'app_005',
      university: universities[4], // University of Chicago
      program: 'Economics',
      status: 'decided' as ApplicationStatus,
      deadline: '2023-10-30T00:00:00.000Z',
      createdAt: '2023-07-05T00:00:00.000Z',
      decisionType: 'admitted',
      applicationType: 'early_decision' as ApplicationType
    }
  ] as Application[],

  stats: {
    total: 5,
    submitted: 3,
    inProgress: 1,
    upcomingDeadlines: 3
  },

  upcomingDeadlines: [
    {
      id: 'dead_001',
      university: universities[1], // MIT
      type: 'Application Submission',
      date: '2023-11-30T00:00:00.000Z',
      status: 'not_started'
    },
    {
      id: 'dead_002',
      university: universities[3], // Carnegie Mellon
      type: 'Recommendation Letters',
      date: '2023-12-20T00:00:00.000Z',
      status: 'not_started'
    },
    {
      id: 'dead_003',
      university: universities[0], // Stanford
      type: 'Financial Aid Application',
      date: '2024-01-05T00:00:00.000Z',
      status: 'not_started'
    }
  ],

  statusDistribution: [
    { name: 'not_started', value: 1 },
    { name: 'in_progress', value: 1 },
    { name: 'submitted', value: 3 },
    { name: 'under_review', value: 1 },
    { name: 'decided', value: 1 }
  ]
};

// 导出完整类型
export type StudentDashboardData = typeof mockStudentDashboardData;
