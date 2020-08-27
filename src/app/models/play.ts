export interface Play {
  id?: string;
  formation?: string;
  name?: string;
  playCat: string;
  runPass: string;
  fullPlay: string;
  gameCount: number; //front end only
  gameAvg: number; //front end only
  seasonAvg: number; //front end only
}
