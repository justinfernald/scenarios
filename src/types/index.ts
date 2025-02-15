export interface Match {
  p1: string;
  p2: string;
  winner: 'p1' | 'p2';
  date: number; // timestamp in milliseconds
}
