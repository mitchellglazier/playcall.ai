import { Injectable } from "@angular/core";
import { Play } from "app/models/play";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PlaysService {
  constructor(private db: AngularFirestore) {}

  createPlay(play: Play) {
    return this.db.collection("plays").add({
      ...play,
      fullPlay: play.formation ? play.formation + " " + play.name : play.name,
    });
  }

  searchPlay(searchValue: any) {
    return this.db
      .collection("plays", (ref) =>
        ref
          .where("fullPlay", ">=", searchValue)
          .where("fullPlay", "<=", searchValue + "\uf8ff")
      )
      .snapshotChanges()
      .pipe(
        map((res) => {
          return res.map((p: any) => {
            let play = p.payload.doc.data();
            play.id = p.payload.doc.id;
            return play as Play;
          });
        })
      );
  }

  getPlay(userKey: any) {
    return this.db.collection("plays").doc(userKey).snapshotChanges();
  }

  getPlays() {
    return this.db
      .collection("plays", (ref) => ref.orderBy("playCat"))
      .snapshotChanges()
      .pipe(
        map((res) => {
          return res.map((p: any) => {
            let play = p.payload.doc.data();
            play.id = p.payload.doc.id;
            return play as Play;
          });
        })
      );
  }

  updatePlay(userKey: any, value: any) {
    return this.db.collection("plays").doc(userKey).set(value);
  }

  deletePlay(userKey: any) {
    return this.db.collection("plays").doc(userKey).delete();
  }
}
