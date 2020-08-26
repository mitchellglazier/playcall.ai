import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TeamsService } from "app/services/teams.service";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.css"],
})
export class TeamComponent implements OnInit {
  teamId: any;
  team: any;

  constructor(
    private route: ActivatedRoute,
    private teamsService: TeamsService
  ) {
    this.teamId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.teamsService.getTeam(this.teamId).subscribe((team) => {
      this.team = team.payload.data();
    });
  }
}
