import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GamesService } from "app/services/games.service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  gameId: any;
  game: any;

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService
  ) {
    this.gameId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.gamesService.getGame(this.gameId).subscribe((game) => {
      this.game = game.payload.data();
    });
  }
}
