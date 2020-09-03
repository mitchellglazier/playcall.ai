export interface Play {
  id?: string;
  formation?: string;
  name?: string;
  playCat: string;
  runPass: string;
  fullPlay: string;
  primaryPos: string;
  gameCount: number; //front end only
  gameAvg: number; //front end only
  seasonAvg: string; //front end only
  seasonCount: number; //front end only
}
