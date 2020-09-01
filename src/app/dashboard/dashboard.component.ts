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
      });
    });
  }
}
