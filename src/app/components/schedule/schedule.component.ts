import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { GamesService } from "app/services/games.service";
import { TeamsService } from "app/services/teams.service";
import { Subscription } from "rxjs";
import { SettingsService } from "app/services/settings.service";
import { Setting } from "app/models/setting";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.css"],
})
export class ScheduleComponent implements OnInit, OnDestroy {
  $gamesSub!: Subscription;
  $teamsSub!: Subscription;
  displayedColumns: string[] = [
    "team",
    "date",
    "location",
    "outcome",
    "score",
    "delete",
  ];
  dataSource = [];
  gameForm!: FormGroup;
  games!: Array<any>;
  teams: Array<any> = [];
  fronts: string[] = [];
  wins = 0;
  losses = 0;
  pointsFor = 0;
  pointsAgainst = 0;
  completedGames = 0;
  avgPoints!: string;
  avgPointsAgainst!: string;

  settingUserKey = "UAK9rOvMQ854IgMQm8Do";
  $settingSub!: Subscription;

  constructor(
    private gamesService: GamesService,
    private teamsService: TeamsService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.gameForm = new FormGroup({
      team: new FormControl(null),
      date: new FormControl(null),
      ourScore: new FormControl(null),
      opponentScore: new FormControl(null),
      location: new FormControl(null),
      gamePlays: new FormControl([]),
      outcome: new FormControl(null),
      expectedFront: new FormControl(null),
    });
    this.$gamesSub = this.gamesService.getGames().subscribe((result) => {
      this.games = result;
      this.games.sort((a, b) => {
        const x = a.payload.doc.data().date.toLocaleString();
        const y = b.payload.doc.data().date.toLocaleString();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
      const wins = [];
      const losses = [];
      this.games.map((game) => {
        if (game.payload.doc.data().outcome === "Win") {
          this.wins++;
        } else if (game.payload.doc.data().outcome === "Loss") {
          this.losses++;
        }
        if (game.payload.doc.data().outcome) {
          this.completedGames++;
          if (game.payload.doc.data().ourScore) {
            this.pointsFor = this.pointsFor + game.payload.doc.data().ourScore;
          }
          if (game.payload.doc.data().opponentScore) {
            this.pointsAgainst =
              this.pointsAgainst + game.payload.doc.data().opponentScore;
          }
        }
      });
      this.avgPoints = (this.pointsFor / this.completedGames).toFixed(2);
      this.avgPointsAgainst = (
        this.pointsAgainst / this.completedGames
      ).toFixed(2);
    });
    this.$teamsSub = this.teamsService.getTeams().subscribe((result) => {
      result.map((team) => {
        this.teams.push(team.payload.doc.data());
      });
    });
    this.$settingSub = this.settingsService
      .getSetting(this.settingUserKey)
      .subscribe((setting: any) => {
        const currentSetting: Setting = setting.payload.data();
        if (currentSetting.fronts) {
          this.fronts = currentSetting.fronts;
        }
      });
  }

  ngOnDestroy() {
    this.$gamesSub.unsubscribe();
    this.$teamsSub.unsubscribe();
  }

  save() {
    this.gamesService.createGame(this.gameForm.value);
    this.gameForm.reset();
  }

  delete(element: any) {
    this.gamesService.deleteGame(element.payload.doc.id);
  }
}
