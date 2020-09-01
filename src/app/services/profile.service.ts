import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Team } from "app/models/team";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private db: AngularFirestore) {}

  createProfile(profile: Team) {
    return this.db.collection("profile").add({
      id: 1,
      name: profile.name,
      mascot: profile.mascot,
      location: profile.location,
      primaryColor: profile.primaryColor,
      coaches: profile.coaches,
      currentCoach: profile.currentCoach,
    });
  }

  getProfile(userKey: any) {
    return this.db.collection("profile").doc(userKey).snapshotChanges();
  }

  updateProfile(userKey: any, value: any) {
    return this.db.collection("profile").doc(userKey).set(value);
  }

  deleteProfile(userKey: any) {
    return this.db.collection("profile").doc(userKey).delete();
  }
}
