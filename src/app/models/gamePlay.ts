import { Play } from "../models/play";

export interface GamePlay {
  id?: string;
  date?: Date;
  play: Play;
  result: number;
  success: boolean;
  down: number;
  distance: number;
  yardLine: number;
  ppp: number;
}
