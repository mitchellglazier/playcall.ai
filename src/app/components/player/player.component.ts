import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PlayersService } from "app/services/players.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"],
})
export class PlayerComponent implements OnInit, OnDestroy {
  $playerSub!: Subscription;
  playerId: any;
  player: any;

  constructor(
    private route: ActivatedRoute,
    private playersService: PlayersService
  ) {
    this.playerId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.$playerSub = this.playersService
      .getPlayer(this.playerId)
      .subscribe((player) => {
        this.player = player.payload.data();
      });
  }

  ngOnDestroy() {
    this.$playerSub.unsubscribe();
  }
}
