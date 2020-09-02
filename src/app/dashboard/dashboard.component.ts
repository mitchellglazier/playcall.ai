import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProfileService } from "app/services/profile.service";
import { PlayersService } from "app/services/players.service";
import { PlaysService } from "app/services/plays.service";
import { GamesService } from "app/services/games.service";
import { Game } from "app/models/game";
import { GamePlay } from "app/models/gamePlay";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentProfile!: any;
  profileUserKey = "JWaseaRYNTfFX31oH00L";

  players: any[] = [];
  plays: any[] = [];
  games: any[] = [];

  seasonPlays: any[] = [];
  seasonTotalYards: any;
  seasonAvgYards: any;
  seasonRunPlays: GamePlay[] = [];
  seasonPassPlays: GamePlay[] = [];

  runAvg!: string;
  totalRushYards!: number;
  passAvg!: string;
  totalPassYards!: number;

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

  $profileSub!: Subscription;
  $playersSub!: Subscription;
  $playsSub!: Subscription;
  $gamesSub!: Subscription;

  constructor(
    private playsService: PlaysService,
    private profileService: ProfileService,
    private playersService: PlayersService,
    private gamesService: GamesService
  ) {}

  ngOnInit(): void {
    this.$profileSub = this.profileService
      .getProfile(this.profileUserKey)
      .subscribe((profile) => {
        this.currentProfile = profile.payload.data();
      });
    this.$playersSub = this.playersService.getPlayers().subscribe((result) => {
      this.players = result;
    });
    this.$playsSub = this.playsService.getPlays().subscribe((result) => {
      this.plays = result;
    });
    this.$gamesSub = this.gamesService.getGames().subscribe((result) => {
      this.games = result;
      result.map((game: any) => {
        game.payload.doc.data().gamePlays.map((gamePlay: GamePlay) => {
          this.seasonPlays.push(gamePlay);
        });
      });
      this.seasonTotalYards = this.seasonPlays
        .map((p) => p.result * 1)
        .reduce((acc, value) => acc + value, 0);
      this.seasonAvgYards = (
        this.seasonTotalYards / this.seasonPlays.length
      ).toFixed(2);
      this.seasonPlays.map((gamePlay: GamePlay) => {
        if (gamePlay.play.runPass === "Run") {
          this.seasonRunPlays.push(gamePlay);
        } else {
          this.seasonPassPlays.push(gamePlay);
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
    });
  }

  ngOnDestroy() {
    this.$gamesSub.unsubscribe();
    this.$playersSub.unsubscribe();
    this.$playsSub.unsubscribe();
    this.$profileSub.unsubscribe();
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
    this.totalRushYards = this.seasonRunPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.totalPassYards = this.seasonPassPlays
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
    this.runAvg = (this.totalRushYards / this.seasonRunPlays.length).toFixed(2);
    this.passAvg = (this.totalPassYards / this.seasonPassPlays.length).toFixed(
      2
    );
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
}
