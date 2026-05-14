export interface ProjectInfo {
  clientName: string;
  website: string;
  industry: string;
  businessGoals: string;
  targetKeywords: string;
  targetAudience: string;
  competitors: string;
  currentIssues: string;
  budget: string;
  timeline: string;
  projectManager: string;
  seoLead: string;
  additionalNotes: string;
}

export interface PresentationContent {
  projectTitle: string;
  clientName: string;
  date: string;
  agenda: {
    items: string[];
  };
  clientOverview: {
    companyDescription: string;
    keyFacts: string[];
    goals: string[];
  };
  currentSituation: {
    websiteStatus: string;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
  keywordsAudience: {
    primaryKeywords: string[];
    secondaryKeywords: string[];
    audienceProfile: {
      demographics: string;
      interests: string[];
      searchBehavior: string;
    };
  };
  competitorAnalysis: {
    mainCompetitors: {
      name: string;
      strengths: string;
    }[];
    competitiveGaps: string[];
    ourAdvantages: string[];
  };
  seoStrategy: {
    technical: string[];
    onPage: string[];
    content: string[];
    linkBuilding: string[];
  };
  actionPlan: {
    month1: {
      title: string;
      tasks: { task: string; deliverable: string; priority: string }[];
    };
    month2_3: {
      title: string;
      tasks: { task: string; deliverable: string; priority: string }[];
    };
  };
  kpis: {
    metric: string;
    current: string;
    target3m: string;
    target6m: string;
  }[];
  timeline: {
    phases: {
      phase: string;
      duration: string;
      milestones: string[];
    }[];
  };
  team: {
    members: {
      role: string;
      name: string;
      responsibilities: string[];
    }[];
  };
}

export interface ExportResult {
  driveLink: string;
  fileName: string;
  fileId: string;
}
