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
  formationsForm!: FormGroup;
  catArray: Array<any> = [];
  posArray: Array<any> = [];
  formationsArray: Array<any> = [];

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
    this.formationsForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });
    this.settingForm = new FormGroup({
      playCats: new FormControl([]),
      positions: new FormControl([]),
      formations: new FormControl([]),
    });
    this.settingsService
      .getSetting(this.settingUserKey)
      .subscribe((setting) => {
        this.currentSetting = setting.payload.data();
        this.catArray = this.currentSetting.playCats;
        this.posArray = this.currentSetting.positions;
        this.formationsArray = this.currentSetting.formations;
        if (!!setting && !!this.currentSetting) {
          this.settingForm.patchValue({
            playCats: this.currentSetting.playCats,
            positions: this.currentSetting.positions,
            formations: this.currentSetting.formations,
          });
        }
      });
  }

  saveCat() {
    this.catArray.push(this.catForm.value);
    this.settingForm.patchValue({
      playCats: this.catArray,
      positions: this.currentSetting.positions,
      formations: this.currentSetting.formations,
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
      formations: this.currentSetting.formations,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
    this.posForm.reset();
  }

  saveFormation() {
    this.formationsArray.push(this.formationsForm.value);
    this.settingForm.patchValue({
      playCats: this.currentSetting.playCats,
      positions: this.currentSetting.positions,
      formations: this.formationsArray,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
    this.formationsForm.reset();
  }

  deletePos(pos: any) {
    this.posArray = this.posArray.filter(function (obj) {
      return obj.name !== pos.name;
    });
    this.settingForm.patchValue({
      positions: this.posArray,
      playCats: this.currentSetting.playCats,
      formations: this.currentSetting.formations,
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
      formations: this.currentSetting.formations,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
  }

  deleteFormation(formation: any) {
    this.formationsArray = this.formationsArray.filter(function (obj) {
      return obj.name !== formation.name;
    });
    this.settingForm.patchValue({
      positions: this.currentSetting.positions,
      playCats: this.currentSetting.playCats,
      formations: this.formationsArray,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
  }
}
