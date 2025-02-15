import { Timestamp } from 'firebase-admin/firestore';

// functions/src/types.ts
export interface Scenario {
  id?: string;
  scenarioText: string;
  rating: number;
  timesShown: number;
  timesChosen: number;
  createdBy: string;
  createdAt: Timestamp;
}

export interface User {
  id: string;
  credibility: number;
}
