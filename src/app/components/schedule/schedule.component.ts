import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { GamesService } from "app/services/games.service";
import { TeamsService } from "app/services/teams.service";
import { Subscription } from "rxjs";
import { SettingsService } from "app/services/settings.service";
import { Setting } from "app/models/setting";
import { Game } from "app/models/game";

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
  games!: Array<Game>;
  teams: Array<any> = [];
  fronts: string[] = [];
  wins = 0;
  losses = 0;
  pointsFor = 0;
  pointsAgainst = 0;
  completedGames = 0;
  avgPoints: number = 0;
  avgPointsAgainst: number = 0;

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
    this.$gamesSub = this.gamesService
      .getGames()
      .subscribe((result: Game[]) => {
        this.games = result;
        this.games.map((game) => {
          if (game.outcome === "Win") {
            this.wins++;
          } else if (game.outcome === "Loss") {
            this.losses++;
          }
          if (game.outcome) {
            this.completedGames++;
            if (game.ourScore) {
              this.pointsFor = this.pointsFor + parseFloat(game.ourScore);
            }
            if (game.opponentScore) {
              this.pointsAgainst =
                this.pointsAgainst + parseFloat(game.opponentScore);
            }
          }
        });
        if (this.completedGames > 0) {
          this.avgPoints = parseFloat(
            (this.pointsFor / this.completedGames).toFixed(2)
          );
          this.avgPointsAgainst = parseFloat(
            (this.pointsAgainst / this.completedGames).toFixed(2)
          );
        }
      });
    this.$teamsSub = this.teamsService.getTeams().subscribe((result) => {
      result.map((team) => {
        this.teams.push(team.payload.doc.data());
      });
    });
    this.$settingSub = this.settingsService
      .getSetting(this.settingUserKey)
      .subscribe((setting: Setting) => {
        const currentSetting: Setting = setting;
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

  delete(game: Game) {
    this.gamesService.deleteGame(game.id);
  }
}
