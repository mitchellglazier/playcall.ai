import { Component, OnInit, ViewChild, Input, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GamesService } from "app/services/games.service";
import { PlaysService } from "app/services/plays.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { GamePlay } from "app/models/gamePlay";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ProfileService } from "app/services/profile.service";
import { Subscription } from "rxjs";
import { SettingsService } from "app/services/settings.service";
import { Play } from "app/models/play";
import { TeamsService } from "app/services/teams.service";
import { Game } from "app/models/game";
import pppArray from "assets/data/ppp.json";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit, OnDestroy {
  gamePlaysArray!: MatTableDataSource<any>;
  displayedColumns1: string[] = ["play", "result", "yardLine", "pp", "delete"];
  @ViewChild("TableTwoPaginator", { static: true })
  tableTwoPaginator!: MatPaginator;

  playsArray!: MatTableDataSource<any>;
  displayedColumns2: string[] = ["play", "gameCount", "gameAvg"];
  @ViewChild("TableOnePaginator", { static: true })
  tableOnePaginator!: MatPaginator;
  @ViewChild("TableOneSort", { static: true }) tableOneSort!: MatSort;

  $currentProfileSub!: Subscription;
  $gameSub!: Subscription;
  $playsSub!: Subscription;
  $gamesSub!: Subscription;

  gameId: any;
  game: any;

  gameForm!: FormGroup;
  outcomeForm!: FormGroup;
  gamePlayForm!: FormGroup;

  selectPlays: Array<any> = [];

  runPlays: GamePlay[] = [];
  totalRushYards!: number;
  passPlays: GamePlay[] = [];
  totalPassYards!: number;
  totalYards: number = 0;
  totalProjectedPoints: number = 0;
  avgYards: number = 0;

  runAvg!: string;
  passAvg!: string;

  $teamsSub!: Subscription;

  teams: Array<any> = [];
  fronts: string[] = [];
  playTypeHeaders: string[] = [];
  positionTypeHeaders: string[] = [];
  playTypesArray: Array<any> = [];
  positionTypesArray: Array<any> = [];
  settingsSub!: Subscription;

  currentProfile!: any;
  profileUserKey = "JWaseaRYNTfFX31oH00L";
  settingUserKey = "UAK9rOvMQ854IgMQm8Do";
  results: any;

  rightRunYards!: number;
  rightRunAvg!: string;

  leftRunYards!: number;
  leftRunAvg!: string;

  rightPassYards!: number;
  rightPassAvg!: string;

  leftPassYards!: number;
  leftPassAvg!: string;

  selectedPlay: any;
  @Input() placeholder = "Play";

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService,
    private playsService: PlaysService,
    private profileService: ProfileService,
    private settingsService: SettingsService,
    private teamsService: TeamsService
  ) {
    this.gameId = this.route.snapshot.paramMap.get("id");
    this.gamePlaysArray = new MatTableDataSource();
    this.playsArray = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.gamePlayForm = new FormGroup({
      date: new FormControl(null),
      gameId: new FormControl(null),
      play: new FormControl(null, Validators.required),
      result: new FormControl(null, Validators.required),
      yardLine: new FormControl(null, Validators.required),
      ppp: new FormControl(null),
    });
    this.outcomeForm = new FormGroup({
      outcome: new FormControl(null, Validators.required),
      opponentScore: new FormControl(null, Validators.required),
      ourScore: new FormControl(null, Validators.required),
    });
    this.gameForm = new FormGroup({
      team: new FormControl(null),
      date: new FormControl(null),
      ourScore: new FormControl(null),
      opponentScore: new FormControl(null),
      location: new FormControl(null),
      outcome: new FormControl(null),
      gamePlays: new FormControl(),
      expectedFront: new FormControl(null),
    });
    this.$currentProfileSub = this.profileService
      .getProfile(this.profileUserKey)
      .subscribe((profile) => {
        this.currentProfile = profile.payload.data();
      });
    this.$gameSub = this.gamesService
      .getGame(this.gameId)
      .subscribe((game: Game) => {
        this.game = game;
        if (this.game) {
          this.gameForm.patchValue({
            ...this.game,
          });
        }
        if (this.game.outcome) {
          this.outcomeForm.patchValue({
            outcome: this.game.outcome,
            opponentScore: this.game.opponentScore,
            ourScore: this.game.ourScore,
          });
        }
        this.gamePlaysArray.data = this.game.gamePlays;
        if (this.gamePlaysArray.data) {
          this.totalYards = this.gamePlaysArray.data
            .map((p) => p.result * 1)
            .reduce((acc, value) => acc + value, 0);
          this.totalProjectedPoints = this.gamePlaysArray.data
            .map((p) => p.ppp * 1)
            .reduce((acc, value) => acc + value, 0);
          if (this.gamePlaysArray.data.length) {
            this.avgYards = parseFloat(
              (this.totalYards / this.gamePlaysArray.data.length).toFixed(2)
            );
          }
          this.gamePlaysArray.data.map((gamePlay: GamePlay) => {
            if (gamePlay.play.runPass === "Run") {
              this.runPlays.push(gamePlay);
            } else {
              this.passPlays.push(gamePlay);
            }
            this.playTypeStats();
          });
        }
      });
    this.settingsSub = this.settingsService
      .getSetting(this.settingUserKey)
      .subscribe((setting: any) => {
        this.fronts = setting.fronts;
        this.playTypeHeaders = setting.playCats;
        this.calculateCatStats();
        this.positionTypeHeaders = setting.positions;
        this.calculatePositionStats();
      });
    this.$playsSub = this.playsService.getPlays().subscribe((plays: Play[]) => {
      this.selectPlays = plays;
      this.playsArray.data = this.selectPlays;
      if (this.playsArray.data.length) {
        this.playsArray.data.map((play) => {
          const playName = play.fullPlay;
          const gamePlays: Array<any> = [];
          if (this.gamePlaysArray.data) {
            this.gamePlaysArray.data.map((gamePlay) => {
              if (gamePlay.play.fullPlay === playName) {
                gamePlays.push(gamePlay);
              }
              if (gamePlays.length) {
                play.gameAvg = (
                  gamePlays
                    .map((p) => p.result * 1)
                    .reduce((acc, value) => acc + value, 0) / gamePlays.length
                ).toFixed(2);
                play.gameCount = gamePlays.length;
              }
            });
          }
        });
      }
    });
    this.gamePlaysArray.paginator = this.tableTwoPaginator;
    this.playsArray.paginator = this.tableOnePaginator;
    this.playsArray.sort = this.tableOneSort;
  }

  ngOnDestroy() {
    this.$currentProfileSub.unsubscribe();
    this.$gameSub.unsubscribe();
    this.$playsSub.unsubscribe();
    this.settingsSub.unsubscribe();
  }

  calculateCatStats() {
    this.playTypeHeaders.map((playType: any) => {
      const playCat = playType.name;
      const catPlays: any = [];
      this.gamePlaysArray.data.map((gamePlay: GamePlay) => {
        if (playType.name === gamePlay.play.playCat) {
          catPlays.push(gamePlay);
        }
      });
      this.playTypesArray.push({ name: playCat, plays: catPlays });
      if (this.playTypesArray.length) {
        this.playTypesArray.map((pc) => {
          const rightPlays: Array<any> = [];
          const leftPlays: Array<any> = [];
          pc.plays.sort((b: any, a: any) => {
            const x = a.result;
            const y = b.result;
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          });
          if (pc.plays.length) {
            pc.biggestPlay = pc.plays[0];
          }
          pc.plays.map((play: GamePlay) => {
            if (play.play.Direction === "Right") {
              rightPlays.push(play);
            } else if (play.play.Direction === "Left") {
              leftPlays.push(play);
            }
            if (rightPlays.length) {
              pc.rightPlays = rightPlays.length;
              pc.rightYards = rightPlays
                .map((p: any) => p.result * 1)
                .reduce((acc: any, value: any) => acc + value, 0);
              pc.rightAvgYards = (pc.rightYards / rightPlays.length).toFixed(2);
            }
            if (leftPlays.length) {
              pc.leftPlays = leftPlays.length;
              pc.leftYards = leftPlays
                .map((p: any) => p.result * 1)
                .reduce((acc: any, value: any) => acc + value, 0);
              pc.leftAvgYards = (pc.leftYards / leftPlays.length).toFixed(2);
            }
          });
          pc.totalYards = pc.plays
            .map((p: any) => p.result * 1)
            .reduce((acc: any, value: any) => acc + value, 0);
          pc.avgYards = (pc.totalYards / pc.plays.length).toFixed(2);
        });
      }
      this.playTypesArray.sort((b, a) => {
        const x = a.totalYards;
        const y = b.totalYards;
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
    });
  }

  calculatePositionStats() {
    this.positionTypeHeaders.map((positionType: any) => {
      const position = positionType.name;
      const positionPlays: any = [];
      this.gamePlaysArray.data.map((gamePlay: GamePlay) => {
        if (positionType.name === gamePlay.play.primaryPos) {
          positionPlays.push(gamePlay);
        }
      });
      this.positionTypesArray.push({
        name: position,
        plays: positionPlays,
      });
      if (this.positionTypesArray.length) {
        this.positionTypesArray.map((pc) => {
          pc.totalYards = pc.plays
            .map((p: any) => p.result * 1)
            .reduce((acc: any, value: any) => acc + value, 0);
          pc.avgYards = (pc.totalYards / pc.plays.length).toFixed(2);
        });
      }
      this.positionTypesArray.sort((b, a) => {
        const x = a.totalYards;
        const y = b.totalYards;
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
    });
  }

  delete(element: any) {
    this.gamePlaysArray.data = this.gamePlaysArray.data.filter(function (obj) {
      return obj.date !== element.date;
    });
    this.gameForm.patchValue({
      team: this.game.team,
      date: this.game.date,
      score: this.game.score,
      location: this.game.location,
      outcome: this.game.outcome,
      gamePlays: this.gamePlaysArray.data,
    });
    this.gamesService.updateGame(this.gameId, this.gameForm.value);
  }

  saveGamePlay() {
    let startingObj = pppArray.find(
      (x: any) => x.yardLine === this.gamePlayForm.value.yardLine
    );

    let endingObj = pppArray.find(
      (x: any) =>
        x.yardLookup ===
        startingObj?.yardLookup + this.gamePlayForm.value.result
    );
    if (endingObj && startingObj) {
      this.gamePlayForm.patchValue({
        ppp: parseFloat(
          (endingObj?.startingPoint - startingObj?.startingPoint).toFixed(2)
        ),
      });
    }

    this.runPlays = [];
    this.passPlays = [];
    this.positionTypesArray = [];
    this.playTypesArray = [];
    this.gamePlayForm.patchValue({
      date: new Date(),
      play: this.selectedPlay,
      gameId: this.gameId,
    });
    this.gamePlaysArray.data.push(this.gamePlayForm.value);
    this.gameForm.patchValue({
      ...this.game,
      gamePlays: this.gamePlaysArray.data,
    });
    this.playsArray.data = this.selectPlays;
    this.playsArray.data.map((play) => {
      const playName = play.fullPlay;
      const gamePlays: Array<any> = [];
      this.gamePlaysArray.data.map((gamePlay) => {
        if (gamePlay.play.fullPlay === playName) {
          gamePlays.push(gamePlay);
        }
        if (gamePlays.length) {
          play.gameAvg =
            gamePlays
              .map((p) => p.result * 1)
              .reduce((acc, value) => acc + value, 0) / gamePlays.length;
          play.gameCount = gamePlays.length;
        }
      });
    });
    this.gamesService.updateGame(this.gameId, this.gameForm.value);
    this.gamePlayForm.reset();
    this.calculatePositionStats();
    this.calculateCatStats();
    this.playTypeStats();
  }

  editGame() {
    this.gamesService.updateGame(this.gameId, this.gameForm.value);
  }

  saveOutcome() {
    this.gameForm.patchValue({
      ...this.game,
      ourScore: this.outcomeForm.value.ourScore,
      opponentScore: this.outcomeForm.value.opponentScore,
      outcome: this.outcomeForm.value.outcome,
    });
    this.gamesService.updateGame(this.gameId, this.gameForm.value);
  }

  applyFilterOne(filterValue: string) {
    this.playsArray.filter = filterValue.trim().toLowerCase();
  }

  selectPlay(play: any) {
    this.selectedPlay = play;
    this.gamePlayForm.patchValue({
      play: this.selectedPlay.fullPlay,
    });
    this.results = [];
  }

  playTypeStats() {
    const rightRunPlays: Array<any> = [];
    const leftRunPlays: Array<any> = [];
    const rightPassPlays: Array<any> = [];
    const leftPassPlays: Array<any> = [];
    this.runPlays.map((rp) => {
      if (rp.play.Direction === "Right") {
        rightRunPlays.push(rp);
      } else if (rp.play.Direction === "Left") {
        leftRunPlays.push(rp);
      }
    });
    this.rightRunYards = rightRunPlays
      .map((p: any) => p.result * 1)
      .reduce((acc: any, value: any) => acc + value, 0);
    this.rightRunAvg = (this.rightRunYards / rightRunPlays.length).toFixed(2);
    this.leftRunYards = leftRunPlays
      .map((p: any) => p.result * 1)
      .reduce((acc: any, value: any) => acc + value, 0);
    this.leftRunAvg = (this.leftRunYards / rightRunPlays.length).toFixed(2);
    this.passPlays.map((pp) => {
      if (pp.play.Direction === "Right") {
        rightPassPlays.push(pp);
      } else if (pp.play.Direction === "Left") {
        leftPassPlays.push(pp);
      }
    });
    this.rightPassYards = rightPassPlays
      .map((p: any) => p.result * 1)
      .reduce((acc: any, value: any) => acc + value, 0);
    this.rightPassAvg = (this.rightPassYards / rightPassPlays.length).toFixed(
      2
    );
    this.leftPassYards = leftPassPlays
      .map((p: any) => p.result * 1)
      .reduce((acc: any, value: any) => acc + value, 0);
    this.leftPassAvg = (this.leftPassYards / leftPassPlays.length).toFixed(2);
    this.totalRushYards = this.runPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.totalPassYards = this.passPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.runAvg = (this.totalRushYards / this.runPlays.length).toFixed(2);
    this.passAvg = (this.totalPassYards / this.passPlays.length).toFixed(2);
  }

  onKeyUp($event: any) {
    if ($event.length >= 3) {
      this.playsService.searchPlay($event).subscribe((plays) => {
        this.results = plays;
      });
    }
  }
}
