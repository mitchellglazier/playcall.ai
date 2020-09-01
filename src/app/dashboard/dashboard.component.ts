import { Component, OnInit } from "@angular/core";
import { ProfileService } from "app/services/profile.service";
import { PlayersService } from "app/services/players.service";
import { PlaysService } from "app/services/plays.service";
import { GamesService } from "app/services/games.service";
import { Game } from "app/models/game";
import { GamePlay } from "app/models/gamePlay";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
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

  runAvg!: number;
  totalRushYards!: number;
  passAvg!: number;
  totalPassYards!: number;

  sweepPlays: GamePlay[] = [];
  sweepYards!: number;
  sweepAvg!: number;

  trapPlays: GamePlay[] = [];
  trapYards!: number;
  trapAvg!: number;

  bootPlays: GamePlay[] = [];
  bootYards!: number;
  bootAvg!: number;

  popPassPlays: GamePlay[] = [];
  popPassYards!: number;
  popPassAvg!: number;

  wedgePlays: GamePlay[] = [];
  wedgeYards!: number;
  wedgeAvg!: number;

  crossBlockPlays: GamePlay[] = [];
  crossBlockYards!: number;
  crossBlockAvg!: number;

  counterPlays: GamePlay[] = [];
  counterYards!: number;
  counterAvg!: number;

  bellyPlays: GamePlay[] = [];
  bellyYards!: number;
  bellyAvg!: number;

  downPlays: GamePlay[] = [];
  downYards!: number;
  downAvg!: number;

  keepPassPlays: GamePlay[] = [];
  keepPassYards!: number;
  keepPassAvg!: number;

  reversePlays: GamePlay[] = [];
  reverseYards!: number;
  reverseAvg!: number;

  powerPlays: GamePlay[] = [];
  powerYards!: number;
  powerAvg!: number;

  pass90Plays: GamePlay[] = [];
  pass90Yards!: number;
  pass90Avg!: number;

  specialPlays: GamePlay[] = [];
  specialYards!: number;
  specialAvg!: number;

  screenPlays: GamePlay[] = [];
  screenYards!: number;
  screenAvg!: number;

  constructor(
    private playsService: PlaysService,
    private profileService: ProfileService,
    private playersService: PlayersService,
    private gamesService: GamesService
  ) {}

  ngOnInit(): void {
    this.profileService.getProfile(this.profileUserKey).subscribe((profile) => {
      this.currentProfile = profile.payload.data();
    });
    this.playersService.getPlayers().subscribe((result) => {
      this.players = result;
    });
    this.playsService.getPlays().subscribe((result) => {
      this.plays = result;
    });
    this.gamesService.getGames().subscribe((result) => {
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
        this.playTypeStats();
      });
    });
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
    this.runAvg = this.totalRushYards / this.seasonRunPlays.length;
    this.passAvg = this.totalPassYards / this.seasonPassPlays.length;
    this.sweepAvg = this.sweepYards / this.sweepPlays.length;
    this.trapAvg = this.trapYards / this.trapPlays.length;
    this.bootAvg = this.bootYards / this.bootPlays.length;
    this.popPassAvg = this.popPassYards / this.popPassPlays.length;
    this.wedgeAvg = this.wedgeYards / this.wedgePlays.length;
    this.crossBlockAvg = this.crossBlockYards / this.crossBlockPlays.length;
    this.counterAvg = this.counterYards / this.counterPlays.length;
    this.bellyAvg = this.bellyYards / this.bellyPlays.length;
    this.downAvg = this.downYards / this.downPlays.length;
    this.keepPassAvg = this.keepPassYards / this.keepPassPlays.length;
    this.reverseAvg = this.reverseYards / this.reversePlays.length;
    this.powerAvg = this.powerYards / this.powerPlays.length;
    this.pass90Avg = this.pass90Yards / this.pass90Plays.length;
    this.specialAvg = this.specialYards / this.specialPlays.length;
    this.screenAvg = this.screenYards / this.screenPlays.length;
  }
}
