import { Team } from "../models/team";
import { GamePlay } from "../models/gamePlay";

export interface Game {
  id?: string;
  team: Team;
  date?: Date;
  score?: string;
  location?: string;
  gamePlays?: GamePlay[];
  outcome?: string;
}
