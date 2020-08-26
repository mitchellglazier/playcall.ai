import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PlayersService } from "app/services/players.service";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"],
})
export class PlayerComponent implements OnInit {
  playerId: any;
  player: any;

  constructor(
    private route: ActivatedRoute,
    private playersService: PlayersService
  ) {
    this.playerId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.playersService.getPlayer(this.playerId).subscribe((player) => {
      this.player = player.payload.data();
    });
  }
}
