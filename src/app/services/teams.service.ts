import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Team } from "app/models/team";

@Injectable({
  providedIn: "root",
})
export class TeamsService {
  constructor(private db: AngularFirestore) {}

  createTeam(team: Team) {
    return this.db.collection("teams").add({
      name: team.name,
      mascot: team.mascot,
      location: team.location,
      primaryColor: team.primaryColor,
    });
  }

  getTeam(userKey: any) {
    return this.db.collection("teams").doc(userKey).snapshotChanges();
  }

  getTeams() {
    return this.db.collection("teams").snapshotChanges();
  }

  updateTeam(userKey: any, value: any) {
    return this.db.collection("teams").doc(userKey).set(value);
  }

  deleteTeam(userKey: any) {
    return this.db.collection("teams").doc(userKey).delete();
  }
}
