export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  age: string;
  highestEducation: string;
  course?: string;
  skills: string[];
  jobPreferences? : {
    categoriesInterested: string[];
    remoteJob: boolean;
    OnSiteJob: boolean;
    HybridJob: boolean;
    govtJob:  boolean;
    nonGovtJob: boolean;
  }
}