export interface Submission {
  id: string;
  userId: string;
  fullName: string;
  displayAs: 'Full name' | 'First name only' | 'Anonymous Bruin';
  occasion: string;
  location: string;
  brands: string[];
  photoUrl: string;
  upvotes: number;
  reactions: Record<string, number>;
  createdAt: any;
}

export interface WaitlistEntry {
  fullName: string;
  uclaEmail: string;
  socialHandle?: string;
  wouldPost: 'Yes' | 'Maybe' | 'No';
  visibilityPreference: 'Public' | 'Anonymous';
  usagePurpose: string[];
  createdAt: any;
}

export interface FeedbackEntry {
  downloadLikelihood: 'Yes' | 'Maybe' | 'No';
  postingFrequency: string;
  anonymousPreference: boolean;
  inviteFriend: boolean;
  comfortFactors: string;
  topFeature: string;
  createdAt: any;
}
