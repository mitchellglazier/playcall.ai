import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { GamesService } from "app/services/games.service";
import { TeamsService } from "app/services/teams.service";

@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.css"],
})
export class ScheduleComponent implements OnInit {
  displayedColumns: string[] = [
    "team",
    "date",
    "location",
    "outcome",
    "score",
    "delete",
  ];
  dataSource = [];
  gameForm!: FormGroup;
  games!: Array<any>;
  teams: Array<any> = [];

  constructor(
    private gamesService: GamesService,
    private teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    this.gameForm = new FormGroup({
      team: new FormControl(null),
      date: new FormControl(null),
      ourScore: new FormControl(null),
      opponentScore: new FormControl(null),
      location: new FormControl(null),
      gamePlays: new FormControl([]),
      outcome: new FormControl(null),
    });
    this.gamesService.getGames().subscribe((result) => {
      this.games = result;
      this.games.sort((a, b) => {
        const x = a.payload.doc.data().date.toLocaleString();
        const y = b.payload.doc.data().date.toLocaleString();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
    });
    this.teamsService.getTeams().subscribe((result) => {
      result.map((team) => {
        this.teams.push(team.payload.doc.data());
      });
    });
  }

  save() {
    // console.log(this.gameForm.value);
    this.gamesService.createGame(this.gameForm.value);
    this.gameForm.reset();
  }

  delete(element: any) {
    this.gamesService.deleteGame(element.payload.doc.id);
  }
}
