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
  displayedColumns2: string[] = ["play", "gameCount", "gameAvg", "seasonAvg"];
  @ViewChild("TableOnePaginator", { static: true })
  tableOnePaginator!: MatPaginator;
  @ViewChild("TableOneSort", { static: true }) tableOneSort!: MatSort;

  $currentProfileSub!: Subscription;
  $gameSub!: Subscription;
  $playsSub!: Subscription;

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

  sweepPlays: GamePlay[] = [];
  sweepYards!: number;
  sweepAvg!: string;

  trapPlays: GamePlay[] = [];
  trapYards!: number;
  trapAvg!: string;

  bootPlays: GamePlay[] = [];
  bootYards!: number;
  bootAvg!: string;

  popPassPlays: GamePlay[] = [];
  popPassYards!: number;
  popPassAvg!: string;

  wedgePlays: GamePlay[] = [];
  wedgeYards!: number;
  wedgeAvg!: string;

  crossBlockPlays: GamePlay[] = [];
  crossBlockYards!: number;
  crossBlockAvg!: string;

  counterPlays: GamePlay[] = [];
  counterYards!: number;
  counterAvg!: string;

  bellyPlays: GamePlay[] = [];
  bellyYards!: number;
  bellyAvg!: string;

  downPlays: GamePlay[] = [];
  downYards!: number;
  downAvg!: string;

  keepPassPlays: GamePlay[] = [];
  keepPassYards!: number;
  keepPassAvg!: string;

  reversePlays: GamePlay[] = [];
  reverseYards!: number;
  reverseAvg!: string;

  powerPlays: GamePlay[] = [];
  powerYards!: number;
  powerAvg!: string;

  pass90Plays: GamePlay[] = [];
  pass90Yards!: number;
  pass90Avg!: string;

  specialPlays: GamePlay[] = [];
  specialYards!: number;
  specialAvg!: string;

  screenPlays: GamePlay[] = [];
  screenYards!: number;
  screenAvg!: string;

  qbPlays: GamePlay[] = [];
  lhbPlays: GamePlay[] = [];
  rhbPlays: GamePlay[] = [];
  fbPlays: GamePlay[] = [];
  tePlays: GamePlay[] = [];
  wrPlays: GamePlay[] = [];

  qbYards!: number;
  lhbYards!: number;
  rhbYards!: number;
  fbYards!: number;
  teYards!: number;
  wrYards!: number;

  qbAvg!: string;
  lhbAvg!: string;
  rhbAvg!: string;
  fbAvg!: string;
  teAvg!: string;
  wrAvg!: string;

  currentProfile!: any;
  profileUserKey = "JWaseaRYNTfFX31oH00L";
  results: any;

  selectedPlay: any;
  @Input() placeholder = "Play";

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService,
    private playsService: PlaysService,
    private profileService: ProfileService
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
          if (gamePlay.play.playCat === "Sweep") {
            this.sweepPlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Trap") {
            this.trapPlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Boot") {
            this.bootPlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Pop Pass") {
            this.popPassPlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Wedge") {
            this.wedgePlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Cross Block") {
            this.crossBlockPlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Counter") {
            this.counterPlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Belly") {
            this.bellyPlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Down") {
            this.downPlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Keep Pass") {
            this.keepPassPlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Reverse") {
            this.reversePlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Power") {
            this.powerPlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Pass") {
            this.pass90Plays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Special") {
            this.specialPlays.push(gamePlay);
          } else if (gamePlay.play.playCat === "Screen") {
            this.screenPlays.push(gamePlay);
          }
          if (gamePlay.play.primaryPos === "QB") {
            this.qbPlays.push(gamePlay);
          } else if (gamePlay.play.primaryPos === "Left HB") {
            this.lhbPlays.push(gamePlay);
          } else if (gamePlay.play.primaryPos === "Right HB") {
            this.rhbPlays.push(gamePlay);
          } else if (gamePlay.play.primaryPos === "FB") {
            this.fbPlays.push(gamePlay);
          } else if (gamePlay.play.primaryPos === "TE") {
            this.tePlays.push(gamePlay);
          } else if (gamePlay.play.primaryPos === "WR") {
            this.wrPlays.push(gamePlay);
          }
          this.playTypeStats();
          this.optionsStats();
        });
      }
    });
    this.$playsSub = this.playsService.getPlays().subscribe((result) => {
      result.map((play) => {
        this.selectPlays.push(play.payload.doc.data());
        this.selectPlays.sort((a, b) => {
          const x = a.fullPlay.toLocaleString();
          const y = b.fullPlay.toLocaleString();
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        });
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
                play.gameAvg =
                  gamePlays
                    .map((p) => p.result * 1)
                    .reduce((acc, value) => acc + value, 0) / gamePlays.length;
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
    this.qbPlays = [];
    this.lhbPlays = [];
    this.rhbPlays = [];
    this.fbPlays = [];
    this.tePlays = [];
    this.wrPlays = [];
    this.runPlays = [];
    this.passPlays = [];
    this.sweepPlays = [];
    this.trapPlays = [];
    this.bootPlays = [];
    this.popPassPlays = [];
    this.wedgePlays = [];
    this.crossBlockPlays = [];
    this.counterPlays = [];
    this.bellyPlays = [];
    this.downPlays = [];
    this.keepPassPlays = [];
    this.reversePlays = [];
    this.powerPlays = [];
    this.pass90Plays = [];
    this.specialPlays = [];
    this.screenPlays = [];
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
    this.qbYards = this.qbPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.lhbYards = this.lhbPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.rhbYards = this.rhbPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.fbYards = this.fbPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.teYards = this.tePlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.wrYards = this.wrPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.qbAvg = (this.qbYards / this.qbPlays.length).toFixed(2);
    this.lhbAvg = (this.lhbYards / this.lhbPlays.length).toFixed(2);
    this.rhbAvg = (this.rhbYards / this.rhbPlays.length).toFixed(2);
    this.fbAvg = (this.fbYards / this.fbPlays.length).toFixed(2);
    this.teAvg = (this.teYards / this.tePlays.length).toFixed(2);
    this.wrAvg = (this.wrYards / this.wrPlays.length).toFixed(2);
  }

  playTypeStats() {
    this.totalRushYards = this.runPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.totalPassYards = this.passPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.sweepYards = this.sweepPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.trapYards = this.trapPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.bootYards = this.bootPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.popPassYards = this.popPassPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.wedgeYards = this.wedgePlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.crossBlockYards = this.crossBlockPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.counterYards = this.counterPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.bellyYards = this.bellyPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.downYards = this.downPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.keepPassYards = this.keepPassPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.reverseYards = this.reversePlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.powerYards = this.powerPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.pass90Yards = this.pass90Plays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.specialYards = this.specialPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.screenYards = this.screenPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.runAvg = (this.totalRushYards / this.runPlays.length).toFixed(2);
    this.passAvg = (this.totalPassYards / this.passPlays.length).toFixed(2);
    this.sweepAvg = (this.sweepYards / this.sweepPlays.length).toFixed(2);
    this.trapAvg = (this.trapYards / this.trapPlays.length).toFixed(2);
    this.bootAvg = (this.bootYards / this.bootPlays.length).toFixed(2);
    this.popPassAvg = (this.popPassYards / this.popPassPlays.length).toFixed(2);
    this.wedgeAvg = (this.wedgeYards / this.wedgePlays.length).toFixed(2);
    this.crossBlockAvg = (
      this.crossBlockYards / this.crossBlockPlays.length
    ).toFixed(2);
    this.counterAvg = (this.counterYards / this.counterPlays.length).toFixed(2);
    this.bellyAvg = (this.bellyYards / this.bellyPlays.length).toFixed(2);
    this.downAvg = (this.downYards / this.downPlays.length).toFixed(2);
    this.keepPassAvg = (this.keepPassYards / this.keepPassPlays.length).toFixed(
      2
    );
    this.reverseAvg = (this.reverseYards / this.reversePlays.length).toFixed(2);
    this.powerAvg = (this.powerYards / this.powerPlays.length).toFixed(2);
    this.pass90Avg = (this.pass90Yards / this.pass90Plays.length).toFixed(2);
    this.specialAvg = (this.specialYards / this.specialPlays.length).toFixed(2);
    this.screenAvg = (this.screenYards / this.screenPlays.length).toFixed(2);
  }

  onKeyUp($event: any) {
    if ($event.length >= 3) {
      this.playsService.searchPlay($event).subscribe((plays) => {
        this.results = plays;
      });
    }
  }
}
