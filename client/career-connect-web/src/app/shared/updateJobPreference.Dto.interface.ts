
export interface UpdateJobPreferenceDTO {
  highestEducation: string;
  course: string | null | undefined;
  remoteJob: boolean,
  OnSiteJob: boolean;
  HybridJob: boolean;
  govtJob: boolean;
  nonGovtJob: boolean;
  skills: string[];
  categoriesInterested: string[];
}
