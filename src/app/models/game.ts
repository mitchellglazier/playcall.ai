import { Team } from "../models/team";

export interface Game {
  id?: number;
  team: Team;
  date?: Date;
  score?: string;
  location?: string;
}
