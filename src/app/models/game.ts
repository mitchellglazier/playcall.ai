import { Team } from "../models/team";
import { GamePlay } from "../models/gamePlay";

export interface Game {
  id?: string;
  team: Team;
  date?: Date;
  opponentScore?: string;
  ourScore?: string;
  location?: string;
  gamePlays?: GamePlay[];
  outcome?: string;
}
