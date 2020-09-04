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
  // seasonPlays: GamePlay[] = [];

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
          this.optionsStats();
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
          // const seasonPlays: Array<any> = [];
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
          // this.$gamesSub = this.gamesService.getGames().subscribe((r) => {
          //   r.map((game: any) => {
          //     game.payload.doc.data().gamePlays.map((gp: GamePlay) => {
          //       this.seasonPlays.push(gp);
          //     });
          //     if (this.seasonPlays) {
          //       this.seasonPlays.map((sgp: GamePlay) => {
          //         if (sgp.play.fullPlay === playName) {
          //           seasonPlays.push(sgp);
          //         }

          //         if (seasonPlays.length) {
          //           play.seasonAvg = (
          //             seasonPlays
          //               .map((p) => p.result * 1)
          //               .reduce((acc, value) => acc + value, 0) /
          //             seasonPlays.length
          //           ).toFixed(2);
          //         }
          //       });
          //     }
          //   });
          // });
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
    this.gamesService.updateGame(this.gameId, this.gameForm.value);
    this.gamePlayForm.reset();
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

  optionsStats() {
    // this.qbYards = this.qbPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.lhbYards = this.lhbPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.rhbYards = this.rhbPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.fbYards = this.fbPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.teYards = this.tePlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.wrYards = this.wrPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.qbAvg = (this.qbYards / this.qbPlays.length).toFixed(2);
    // this.lhbAvg = (this.lhbYards / this.lhbPlays.length).toFixed(2);
    // this.rhbAvg = (this.rhbYards / this.rhbPlays.length).toFixed(2);
    // this.fbAvg = (this.fbYards / this.fbPlays.length).toFixed(2);
    // this.teAvg = (this.teYards / this.tePlays.length).toFixed(2);
    // this.wrAvg = (this.wrYards / this.wrPlays.length).toFixed(2);
  }

  playTypeStats() {
    this.totalRushYards = this.runPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.totalPassYards = this.passPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    // this.sweepYards = this.sweepPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.trapYards = this.trapPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.bootYards = this.bootPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.popPassYards = this.popPassPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.wedgeYards = this.wedgePlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.crossBlockYards = this.crossBlockPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.counterYards = this.counterPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.bellyYards = this.bellyPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.downYards = this.downPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.keepPassYards = this.keepPassPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.reverseYards = this.reversePlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.powerYards = this.powerPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.pass90Yards = this.pass90Plays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.specialYards = this.specialPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    // this.screenYards = this.screenPlays
    //   .map((p) => p.result * 1)
    //   .reduce((acc, value) => acc + value, 0);
    this.runAvg = (this.totalRushYards / this.runPlays.length).toFixed(2);
    this.passAvg = (this.totalPassYards / this.passPlays.length).toFixed(2);
    // this.sweepAvg = (this.sweepYards / this.sweepPlays.length).toFixed(2);
    // this.trapAvg = (this.trapYards / this.trapPlays.length).toFixed(2);
    // this.bootAvg = (this.bootYards / this.bootPlays.length).toFixed(2);
    // this.popPassAvg = (this.popPassYards / this.popPassPlays.length).toFixed(2);
    // this.wedgeAvg = (this.wedgeYards / this.wedgePlays.length).toFixed(2);
    // this.crossBlockAvg = (
    //   this.crossBlockYards / this.crossBlockPlays.length
    // ).toFixed(2);
    // this.counterAvg = (this.counterYards / this.counterPlays.length).toFixed(2);
    // this.bellyAvg = (this.bellyYards / this.bellyPlays.length).toFixed(2);
    // this.downAvg = (this.downYards / this.downPlays.length).toFixed(2);
    // this.keepPassAvg = (this.keepPassYards / this.keepPassPlays.length).toFixed(
    //   2
    // );
    // this.reverseAvg = (this.reverseYards / this.reversePlays.length).toFixed(2);
    // this.powerAvg = (this.powerYards / this.powerPlays.length).toFixed(2);
    // this.pass90Avg = (this.pass90Yards / this.pass90Plays.length).toFixed(2);
    // this.specialAvg = (this.specialYards / this.specialPlays.length).toFixed(2);
    // this.screenAvg = (this.screenYards / this.screenPlays.length).toFixed(2);
  }

  onKeyUp($event: any) {
    if ($event.length >= 3) {
      this.playsService.searchPlay($event).subscribe((plays) => {
        this.results = plays;
      });
    }
  }
}
