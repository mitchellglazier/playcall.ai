import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PlaysService } from "app/services/plays.service";

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.css"],
})
export class PlayComponent implements OnInit {
  playId: any;
  play: any;

  constructor(
    private route: ActivatedRoute,
    private playsService: PlaysService
  ) {
    this.playId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.playsService.getPlay(this.playId).subscribe((play) => {
      this.play = play.payload.data();
    });
  }
}
