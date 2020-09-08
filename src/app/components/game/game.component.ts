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
import { Subject, Observable, Subscription } from "rxjs";
import { SettingsService } from "app/services/settings.service";
import { Play } from "app/models/play";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit, OnDestroy {
  gamePlaysArray!: MatTableDataSource<any>;
  displayedColumns1: string[] = ["play", "result", "delete"];
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
  totalYards!: number;
  avgYards!: string;

  runAvg!: string;
  passAvg!: string;

  playTypeHeaders: string[] = [];
  positionTypeHeaders: string[] = [];
  playTypesArray: Array<any> = [];
  positionTypesArray: Array<any> = [];
  settingsSub!: Subscription;

  currentProfile!: any;
  profileUserKey = "JWaseaRYNTfFX31oH00L";
  settingUserKey = "UAK9rOvMQ854IgMQm8Do";
  results: any;

  selectedPlay: any;
  @Input() placeholder = "Play";

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService,
    private playsService: PlaysService,
    private profileService: ProfileService,
    private settingsService: SettingsService
  ) {
    this.gameId = this.route.snapshot.paramMap.get("id");
    this.gamePlaysArray = new MatTableDataSource();
    this.playsArray = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.gamePlayForm = new FormGroup({
      date: new FormControl(null),
      play: new FormControl(null, Validators.required),
      result: new FormControl(null, Validators.required),
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
    });
    this.$currentProfileSub = this.profileService
      .getProfile(this.profileUserKey)
      .subscribe((profile) => {
        this.currentProfile = profile.payload.data();
      });
    this.$gameSub = this.gamesService.getGame(this.gameId).subscribe((game) => {
      this.game = game.payload.data();
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
        this.avgYards = (
          this.totalYards / this.gamePlaysArray.data.length
        ).toFixed(2);
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
        this.playTypeHeaders = setting.payload.data().playCats;
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
              pc.plays.map((play: GamePlay) => {
                if (play.play.Direction === "Right") {
                  rightPlays.push(play);
                  console.log(rightPlays);
                } else if (play.play.Direction === "Left") {
                  leftPlays.push(play);
                }
                if (rightPlays.length) {
                  pc.rightYards = rightPlays
                    .map((p: any) => p.result * 1)
                    .reduce((acc: any, value: any) => acc + value, 0);
                  pc.rightAvgYards = (
                    pc.rightYards / rightPlays.length
                  ).toFixed(2);
                }
                if (leftPlays.length) {
                  pc.leftYards = leftPlays
                    .map((p: any) => p.result * 1)
                    .reduce((acc: any, value: any) => acc + value, 0);
                  pc.leftAvgYards = (pc.leftYards / leftPlays.length).toFixed(
                    2
                  );
                }
              });
              pc.totalYards = pc.plays
                .map((p: any) => p.result * 1)
                .reduce((acc: any, value: any) => acc + value, 0);
              pc.avgYards = (pc.totalYards / pc.plays.length).toFixed(2);
            });
          }
        });
        this.positionTypeHeaders = setting.payload.data().positions;
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
        });
      });
    this.$playsSub = this.playsService.getPlays().subscribe((result) => {
      result.map((play) => {
        this.selectPlays.push(play.payload.doc.data());
      });
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
    this.runPlays = [];
    this.passPlays = [];
    this.gamePlayForm.patchValue({
      date: new Date(),
      play: this.selectedPlay,
    });
    this.gamePlaysArray.data.push(this.gamePlayForm.value);
    this.gameForm.patchValue({
      team: this.game.team,
      date: this.game.date,
      ourScore: this.game.ourScore,
      opponentScore: this.game.opponentScore,
      location: this.game.location,
      outcome: this.game.outcome,
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
  }

  saveOutcome() {
    this.gameForm.patchValue({
      team: this.game.team,
      date: this.game.date,
      ourScore: this.outcomeForm.value.ourScore,
      opponentScore: this.outcomeForm.value.opponentScore,
      location: this.game.location,
      outcome: this.outcomeForm.value.outcome,
      gamePlays: this.game.gamePlays,
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
