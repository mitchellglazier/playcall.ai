import { Component, OnInit, OnDestroy } from "@angular/core";
import { ProfileService } from "app/services/profile.service";
import { PlayersService } from "app/services/players.service";
import { PlaysService } from "app/services/plays.service";
import { GamesService } from "app/services/games.service";
import { Game } from "app/models/game";
import { GamePlay } from "app/models/gamePlay";
import { Subscription } from "rxjs";
import { SettingsService } from "app/services/settings.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentProfile!: any;
  profileUserKey = "JWaseaRYNTfFX31oH00L";
  settingUserKey = "UAK9rOvMQ854IgMQm8Do";

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

  rightRunYards!: number;
  rightRunAvg!: string;

  leftRunYards!: number;
  leftRunAvg!: string;

  rightPassYards!: number;
  rightPassAvg!: string;

  leftPassYards!: number;
  leftPassAvg!: string;

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
  $settingsSub!: Subscription;

  playTypeHeaders: string[] = [];
  positionTypeHeaders: string[] = [];
  playTypesArray: Array<any> = [];
  positionTypesArray: Array<any> = [];

  constructor(
    private playsService: PlaysService,
    private profileService: ProfileService,
    private playersService: PlayersService,
    private gamesService: GamesService,
    private settingService: SettingsService
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
      this.$settingsSub = this.settingService
        .getSetting(this.settingUserKey)
        .subscribe((setting: any) => {
          this.playTypeHeaders = setting.payload.data().playCats;
          this.playTypeHeaders.map((playType: any) => {
            const playCat = playType.name;
            const catPlays: any = [];
            this.seasonPlays.map((gamePlay: GamePlay) => {
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
                    pc.rightAvgYards = (
                      pc.rightYards / rightPlays.length
                    ).toFixed(2);
                  }
                  if (leftPlays.length) {
                    pc.leftPlays = leftPlays.length;
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
          this.positionTypeHeaders = setting.payload.data().positions;
          this.positionTypeHeaders.map((positionType: any) => {
            const position = positionType.name;
            const positionPlays: any = [];
            this.seasonPlays.map((gamePlay: GamePlay) => {
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
        });
      this.seasonPlays.map((gamePlay: GamePlay) => {
        if (gamePlay.play.runPass === "Run") {
          this.seasonRunPlays.push(gamePlay);
        } else {
          this.seasonPassPlays.push(gamePlay);
        }
        this.playTypeStats();
      });
    });
  }

  ngOnDestroy() {
    this.$gamesSub.unsubscribe();
    this.$playersSub.unsubscribe();
    this.$playsSub.unsubscribe();
    this.$profileSub.unsubscribe();
    this.$settingsSub.unsubscribe();
  }

  playTypeStats() {
    this.totalRushYards = this.seasonRunPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.totalPassYards = this.seasonPassPlays
      .map((p) => p.result * 1)
      .reduce((acc, value) => acc + value, 0);
    this.runAvg = (this.totalRushYards / this.seasonRunPlays.length).toFixed(2);
    this.passAvg = (this.totalPassYards / this.seasonPassPlays.length).toFixed(
      2
    );
    const rightRunPlays: Array<any> = [];
    const leftRunPlays: Array<any> = [];
    const rightPassPlays: Array<any> = [];
    const leftPassPlays: Array<any> = [];
    this.seasonRunPlays.map((rp) => {
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
    this.seasonPassPlays.map((pp) => {
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
  }
}
