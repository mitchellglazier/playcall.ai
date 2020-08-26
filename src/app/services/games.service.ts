import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Game } from "../models/game";

@Injectable({
  providedIn: "root",
})
export class GamesService {
  constructor(private db: AngularFirestore) {}

  createGame(game: Game) {
    return this.db.collection("games").add({
      team: game.team,
      date: game.date,
      score: game.score,
      location: game.location,
    });
  }

  getGame(userKey: any) {
    return this.db.collection("games").doc(userKey).snapshotChanges();
  }

  getGames() {
    return this.db.collection("games").snapshotChanges();
  }

  updateGame(userKey: any, value: any) {
    return this.db.collection("games").doc(userKey).set(value);
  }

  deleteGame(userKey: any) {
    return this.db.collection("games").doc(userKey).delete();
  }
}
