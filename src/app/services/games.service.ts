import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Game } from "../models/game";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class GamesService {
  constructor(private db: AngularFirestore) {}

  createGame(game: Game) {
    return this.db.collection("games").add(game);
  }

  getGame(gameId: string) {
    return this.db
      .collection("games")
      .doc(gameId)
      .snapshotChanges()
      .pipe(
        map((g) => {
          let game = g.payload.data();
          return game as Game;
        })
      );
  }

  getGames(): Observable<Game[]> {
    return this.db
      .collection("games", (ref) => ref.orderBy("date"))
      .snapshotChanges()
      .pipe(
        map((res) => {
          return res.map((g: any) => {
            let game = g.payload.doc.data();
            game.id = g.payload.doc.id;
            return game as Game;
          });
        })
      );
  }

  updateGame(userKey: any, value: any) {
    return this.db.collection("games").doc(userKey).set(value);
  }

  deleteGame(userKey: any) {
    return this.db.collection("games").doc(userKey).delete();
  }
}
