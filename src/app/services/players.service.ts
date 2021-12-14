import { Injectable } from "@angular/core";
import { Player } from "app/models/player";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

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

  getPlayer(playerId: string) {
    return this.db.collection("players").doc(playerId).snapshotChanges();
  }

  getPlayers() {
    return this.db
      .collection("players", (ref) => ref.orderBy("graduationYear"))
      .snapshotChanges()
      .pipe(
        map((res) => {
          return res.map((p: any) => {
            let player = p.payload.doc.data();
            player.id = p.payload.doc.id;
            return player as Player;
          });
        })
      );
  }

  updatePlayer(playerId: any, player: Player) {
    return this.db.collection("players").doc(playerId).set(player);
  }

  deletePlayer(playerId: any) {
    return this.db.collection("players").doc(playerId).delete();
  }
}
