import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Setting } from "../models/setting";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  constructor(private db: AngularFirestore) {}

  createSetting(setting: Setting) {
    return this.db.collection("settings").add(setting);
  }

  getSetting(settingId: string) {
    return this.db
      .collection("settings")
      .doc(settingId)
      .snapshotChanges()
      .pipe(
        map((s) => {
          let setting = s.payload.data();
          return setting as Setting;
        })
      );
  }

  updateSetting(settingId: string, setting: Setting) {
    return this.db.collection("settings").doc(settingId).set(setting);
  }

  deleteSetting(settingId: string) {
    return this.db.collection("settings").doc(settingId).delete();
  }
}
