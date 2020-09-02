import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { TeamsService } from "app/services/teams.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.css"],
})
export class TeamsComponent implements OnInit, OnDestroy {
  $teamsSub!: Subscription;
  displayedColumns: string[] = ["name", "mascot", "location", "primaryColor"];
  dataSource = [];
  teamForm!: FormGroup;
  teams!: Array<any>;

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    this.teamForm = new FormGroup({
      name: new FormControl(null),
      mascot: new FormControl(null),
      location: new FormControl(null),
      primaryColor: new FormControl(null),
    });
    this.$teamsSub = this.teamsService.getTeams().subscribe((result) => {
      this.teams = result;
      this.teams.sort((a, b) => {
        const x = a.payload.doc.data().name.toLocaleString();
        const y = b.payload.doc.data().name.toLocaleString();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
    });
  }

  ngOnDestroy() {
    this.$teamsSub.unsubscribe();
  }

  save() {
    this.teamsService.createTeam(this.teamForm.value);
    this.teamForm.reset();
  }

  delete(element: any) {
    this.teamsService.deleteTeam(element.payload.doc.id);
  }
}
