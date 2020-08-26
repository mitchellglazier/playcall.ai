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

  getPlayer(userKey: any) {
    return this.db.collection("players").doc(userKey).snapshotChanges();
  }

  getPlayers() {
    return this.db.collection("players").snapshotChanges();
  }

  updatePlayer(userKey: any, value: any) {
    return this.db.collection("players").doc(userKey).set(value);
  }

  deletePlayer(userKey: any) {
    return this.db.collection("players").doc(userKey).delete();
  }
}
