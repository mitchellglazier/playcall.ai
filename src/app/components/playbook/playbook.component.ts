import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { PlaysService } from "app/services/plays.service";
import { SettingsService } from "app/services/settings.service";

@Component({
  selector: "app-playbook",
  templateUrl: "./playbook.component.html",
  styleUrls: ["./playbook.component.css"],
})
export class PlaybookComponent implements OnInit {
  displayedColumns: string[] = [
    "formation",
    "name",
    "playCat",
    "runPass",
    "delete",
  ];
  dataSource = [];

  playForm!: FormGroup;
  plays!: Array<any>;

  currentSetting!: any;

  posArray: Array<any> = [];
  catArray: Array<any> = [];
  formationsArray: Array<any> = [];

  settingUserKey = "UAK9rOvMQ854IgMQm8Do";

  constructor(
    private playsService: PlaysService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.playForm = new FormGroup({
      formation: new FormControl(null),
      name: new FormControl(null),
      playCat: new FormControl(null),
      primaryPos: new FormControl(null),
      runPass: new FormControl(null),
    });
    this.playsService.getPlays().subscribe((result) => {
      this.plays = result;
    });
    this.settingsService
      .getSetting(this.settingUserKey)
      .subscribe((setting) => {
        this.currentSetting = setting.payload.data();
        this.catArray = this.currentSetting.playCats;
        this.posArray = this.currentSetting.positions;
        this.formationsArray = this.currentSetting.formations;
      });
  }

  save() {
    this.playsService.createPlay(this.playForm.value);
    this.playForm.reset();
  }

  delete(element: any) {
    this.playsService.deletePlay(element.payload.doc.id);
  }
}
