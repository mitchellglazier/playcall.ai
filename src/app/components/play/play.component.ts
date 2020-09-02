import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PlaysService } from "app/services/plays.service";
import { SettingsService } from "app/services/settings.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.css"],
})
export class PlayComponent implements OnInit, OnDestroy {
  $settingSub!: Subscription;
  $playSub!: Subscription;
  playId: any;
  play: any;

  playForm!: FormGroup;

  settingUserKey = "UAK9rOvMQ854IgMQm8Do";

  posArray: Array<any> = [];
  catArray: Array<any> = [];
  formationsArray: Array<any> = [];

  currentSetting!: any;

  constructor(
    private route: ActivatedRoute,
    private playsService: PlaysService,
    private settingsService: SettingsService
  ) {
    this.playId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.playForm = new FormGroup({
      formation: new FormControl(null),
      name: new FormControl(null),
      playCat: new FormControl(null),
      primaryPos: new FormControl(null),
      runPass: new FormControl(null),
      fullPlay: new FormControl(null),
    });
    this.$settingSub = this.settingsService
      .getSetting(this.settingUserKey)
      .subscribe((setting) => {
        this.currentSetting = setting.payload.data();
        this.catArray = this.currentSetting.playCats;
        this.posArray = this.currentSetting.positions;
        this.formationsArray = this.currentSetting.formations;
      });
    this.$playSub = this.playsService.getPlay(this.playId).subscribe((play) => {
      this.play = play.payload.data();
      if (this.play) {
        this.playForm.patchValue({
          formation: this.play.formation,
          name: this.play.name,
          playCat: this.play.playCat,
          primaryPos: this.play.primaryPos,
          runPass: this.play.runPass,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.$playSub.unsubscribe();
    this.$settingSub.unsubscribe();
  }

  save() {
    if (this.playForm.value.formation && this.playForm.value.name) {
      this.playForm.patchValue({
        fullPlay:
          this.playForm.value.formation + " " + this.playForm.value.name,
      });
    } else {
      this.playForm.patchValue({
        fullPlay: this.playForm.value.name,
      });
    }
    this.playsService.updatePlay(this.playId, this.playForm.value);
  }
}
