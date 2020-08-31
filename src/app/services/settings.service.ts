import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Setting } from "../models/setting";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  constructor(private db: AngularFirestore) {}

  createSetting(setting: Setting) {
    return this.db.collection("settings").add({
      playCats: setting.playCats,
      positions: setting.positions,
      formations: setting.formations,
    });
  }

  getSetting(userKey: any) {
    return this.db.collection("settings").doc(userKey).snapshotChanges();
  }

  updateSetting(userKey: any, value: any) {
    return this.db.collection("settings").doc(userKey).set(value);
  }

  deleteSetting(userKey: any) {
    return this.db.collection("settings").doc(userKey).delete();
  }
}
