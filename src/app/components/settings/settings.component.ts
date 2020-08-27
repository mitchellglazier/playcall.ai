import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SettingsService } from "app/services/settings.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  catForm!: FormGroup;
  posForm!: FormGroup;
  settingForm!: FormGroup;
  catArray: Array<any> = [];
  posArray: Array<any> = [];

  currentSetting!: any;
  settingUserKey = "UAK9rOvMQ854IgMQm8Do";

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.catForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });
    this.posForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });
    this.settingForm = new FormGroup({
      playCats: new FormControl([]),
      positions: new FormControl([]),
    });
    this.settingsService
      .getSetting(this.settingUserKey)
      .subscribe((setting) => {
        this.currentSetting = setting.payload.data();
        this.catArray = this.currentSetting.playCats;
        this.posArray = this.currentSetting.positions;
        if (!!setting && !!this.currentSetting) {
          this.settingForm.patchValue({
            playCats: this.currentSetting.playCats,
            positions: this.currentSetting.postions,
          });
        }
      });
  }

  saveCat() {
    this.catArray.push(this.catForm.value);
    this.settingForm.patchValue({
      playCats: this.catArray,
      positions: this.currentSetting.positions,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
    this.catForm.reset();
  }

  savePos() {
    this.posArray.push(this.posForm.value);
    this.settingForm.patchValue({
      playCats: this.currentSetting.playCats,
      positions: this.posArray,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
    this.posForm.reset();
  }

  deletePos(pos: any) {
    this.posArray = this.posArray.filter(function (obj) {
      return obj.name !== pos.name;
    });
    this.settingForm.patchValue({
      positions: this.posArray,
      playCats: this.currentSetting.playCats,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
  }

  deleteCat(cat: any) {
    this.catArray = this.catArray.filter(function (obj) {
      return obj.name !== cat.name;
    });
    this.settingForm.patchValue({
      positions: this.currentSetting.positions,
      playCats: this.catArray,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
  }
}
