import { Injectable } from "@angular/core";
import { Play } from "app/models/play";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class PlaysService {
  constructor(private db: AngularFirestore) {}

  createPlay(play: Play) {
    return this.db.collection("plays").add({
      formation: play.formation,
      name: play.name,
      playCat: play.playCat,
      runPass: play.runPass,
    });
  }

  getPlay(userKey: any) {
    return this.db.collection("plays").doc(userKey).snapshotChanges();
  }

  getPlays() {
    return this.db.collection("plays").snapshotChanges();
  }

  updatePlay(userKey: any, value: any) {
    return this.db.collection("plays").doc(userKey).set(value);
  }

  deletePlay(userKey: any) {
    return this.db.collection("plays").doc(userKey).delete();
  }
}
