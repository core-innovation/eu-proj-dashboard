export interface ProjectInfo {
  title: string;
  acronym: string;
  grantNumber: string;
  grantType: string;
  maxAmount: string;
  startDate: string;
  endDate: string;
  duration: string;
  coordinator: {
    name: string;
    location: string;
  };
  summary: string;
  participantsIntro: string;
  timelineEvents: TimelineEvent[];
}

export interface TimelineEvent {
  period: string;
  month: number;
  type: 'milestone' | 'report';
  description: string;
}

export interface Participant {
  no: number;
  role: 'Coordinator' | 'Beneficiary';
  shortName: string;
  legalName: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
}

export interface Task {
  id: string;
  title: string;
  leader: string;
}

export interface WorkPackage {
  no: number;
  title: string;
  leader: string;
  start: number;
  end: number;
  tasks: Task[];
}

export interface Deliverable {
  no: string;
  name: string;
  wp: number;
  leader: string;
  type: 'Report' | 'Other';
  level: 'Public' | 'Sensitive' | 'Classified';
  due: number;
}

export interface Milestone {
  no: number;
  name: string;
  wp: number | string;
  leader: string;
  due: number;
}

export interface EUProject {
  projectInfo: ProjectInfo;
  participants: Participant[];
  workPackagesWithTasks: WorkPackage[];
  deliverables: Deliverable[];
  milestones: Milestone[];
}

export interface ProjectCardData {
  id: string;
  acronym: string;
  title: string;
  summary: string;
  coordinator: string;
  country: string;
  maxAmount: string;
  duration: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  deliverableCount: number;
  milestoneCount: number;
}
