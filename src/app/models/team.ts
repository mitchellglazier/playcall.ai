import { Coach } from "../models/coach";

export interface Team {
  id?: string;
  name?: string;
  mascot?: string;
  location?: string;
  primaryColor?: string;
  coaches?: Coach[];
  currentCoach?: any;
}
