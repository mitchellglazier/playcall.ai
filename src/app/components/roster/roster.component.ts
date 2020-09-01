import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { PlayersService } from "app/services/players.service";
import { Player } from "app/models/player";

@Component({
  selector: "app-roster",
  templateUrl: "./roster.component.html",
  styleUrls: ["./roster.component.css"],
})
export class RosterComponent implements OnInit {
  displayedColumns: string[] = ["name", "graduationYear", "delete"];
  dataSource = [];
  rosterForm!: FormGroup;
  players: Array<any> = [];

  constructor(private playersService: PlayersService) {}

  ngOnInit(): void {
    this.rosterForm = new FormGroup({
      name: new FormControl(null),
      graduationYear: new FormControl(null),
    });
    this.playersService.getPlayers().subscribe((result) => {
      this.players = result;
    });
  }

  save() {
    this.playersService.createPlayer(this.rosterForm.value);
    this.rosterForm.reset();
  }

  delete(element: any) {
    this.playersService.deletePlayer(element.payload.doc.id);
  }
}
