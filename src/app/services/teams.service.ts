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

  getTeams() {
    return this.db.collection("teams").snapshotChanges();
  }

  deleteTeam(userKey: any) {
    return this.db.collection("teams").doc(userKey).delete();
  }
}
