import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { TeamsService } from "app/services/teams.service";

@Component({
  selector: "app-teams",
  templateUrl: "./teams.component.html",
  styleUrls: ["./teams.component.css"],
})
export class TeamsComponent implements OnInit {
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
    this.teamsService.getTeams().subscribe((result) => {
      this.teams = result;
    });
  }

  save() {
    this.teamsService.createTeam(this.teamForm.value);
    this.teamForm.reset();
  }

  delete(element: any) {
    this.teamsService.deleteTeam(element.payload.doc.id);
  }
}
