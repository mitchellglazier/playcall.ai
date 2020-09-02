import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TeamsService } from "app/services/teams.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.css"],
})
export class TeamComponent implements OnInit, OnDestroy {
  $teamsSub!: Subscription;
  teamId: any;
  team: any;

  constructor(
    private route: ActivatedRoute,
    private teamsService: TeamsService
  ) {
    this.teamId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.$teamsSub = this.teamsService
      .getTeam(this.teamId)
      .subscribe((team) => {
        this.team = team.payload.data();
      });
  }

  ngOnDestroy() {
    this.$teamsSub.unsubscribe();
  }
}
