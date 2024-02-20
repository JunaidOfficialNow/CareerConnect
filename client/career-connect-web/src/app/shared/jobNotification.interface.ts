export interface JobNotificationDoc {
  _id: string;
  jobTitle: string;
  CompanyOrDept: string;
  description: string;
  location: string;
  category: string;
  educations: string[];
  skills: string[];
  deadline: Date,
  jobType: string;
  govtOrNot: string;
  applicationLink: string;
  officialLink: string;
  websiteLink: string;
  minQualification: string;
  createdAt: string;
}