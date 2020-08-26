import { Injectable } from "@angular/core";
import { Player } from "app/models/player";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class PlayersService {
  constructor(private db: AngularFirestore) {}

  createPlayer(player: Player) {
    return this.db.collection("players").add({
      name: player.name,
      graduationYear: player.graduationYear,
    });
  }

  getPlayers() {
    return this.db.collection("players").snapshotChanges();
  }

  deletePlayer(userKey: any) {
    return this.db.collection("players").doc(userKey).delete();
  }
}
