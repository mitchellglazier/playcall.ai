import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SettingsService } from "app/services/settings.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit, OnDestroy {
  $settingSub!: Subscription;
  catForm!: FormGroup;
  posForm!: FormGroup;
  settingForm!: FormGroup;
  formationsForm!: FormGroup;
  frontForm!: FormGroup;
  catArray: Array<any> = [];
  posArray: Array<any> = [];
  formationsArray: Array<any> = [];
  frontsArray: Array<any> = [];

  currentSetting!: any;
  settingUserKey = "UAK9rOvMQ854IgMQm8Do";

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.frontForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });
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
      fronts: new FormControl([]),
    });
    this.$settingSub = this.settingsService
      .getSetting(this.settingUserKey)
      .subscribe((setting) => {
        this.currentSetting = setting.payload.data();
        this.catArray = this.currentSetting.playCats;
        this.posArray = this.currentSetting.positions;
        this.formationsArray = this.currentSetting.formations;
        this.frontsArray = this.currentSetting.fronts;
        if (!!setting && !!this.currentSetting) {
          this.settingForm.patchValue({
            playCats: this.currentSetting.playCats,
            positions: this.currentSetting.positions,
            formations: this.currentSetting.formations,
            fronts: this.currentSetting.fronts,
          });
        }
      });
  }

  ngOnDestroy() {
    this.$settingSub.unsubscribe();
  }

  saveCat() {
    this.catArray.push(this.catForm.value);
    this.settingForm.patchValue({
      playCats: this.catArray,
      positions: this.currentSetting.positions,
      formations: this.currentSetting.formations,
      fronts: this.currentSetting.fronts,
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
      fronts: this.currentSetting.fronts,
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
      fronts: this.currentSetting.fronts,
      formations: this.formationsArray,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
    this.formationsForm.reset();
  }

  saveFront() {
    this.frontsArray.push(this.frontForm.value);
    this.settingForm.patchValue({
      playCats: this.currentSetting.playCats,
      positions: this.currentSetting.positions,
      formations: this.currentSetting.formations,
      fronts: this.frontsArray,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
    this.frontForm.reset();
  }

  deleteFront(front: any) {
    this.frontsArray = this.frontsArray.filter(function (obj) {
      return obj.name !== front.name;
    });
    this.settingForm.patchValue({
      positions: this.currentSetting.positions,
      playCats: this.currentSetting.playCats,
      formations: this.currentSetting.formations,
      fronts: this.frontsArray,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
  }

  deletePos(pos: any) {
    this.posArray = this.posArray.filter(function (obj) {
      return obj.name !== pos.name;
    });
    this.settingForm.patchValue({
      positions: this.posArray,
      playCats: this.currentSetting.playCats,
      formations: this.currentSetting.formations,
      fronts: this.currentSetting.fronts,
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
      fronts: this.currentSetting.fronts,
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
      fronts: this.currentSetting.fronts,
      formations: this.formationsArray,
    });
    this.settingsService.updateSetting(
      this.settingUserKey,
      this.settingForm.value
    );
  }
}
