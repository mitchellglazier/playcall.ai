import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { PlayersService } from "app/services/players.service";
import { Player } from "app/models/player";
import { Subscription } from "rxjs";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";

@Component({
  selector: "app-roster",
  templateUrl: "./roster.component.html",
  styleUrls: ["./roster.component.css"],
})
export class RosterComponent implements OnInit, OnDestroy {
  players!: MatTableDataSource<any>;
  @ViewChild("TableOnePaginator", { static: true })
  tableOnePaginator!: MatPaginator;
  @ViewChild("TableOneSort", { static: true }) tableOneSort!: MatSort;

  $playersSub!: Subscription;
  displayedColumns: string[] = ["name", "graduationYear", "delete"];
  dataSource = [];
  rosterForm!: FormGroup;
  graduationYears: any;
  graduationHeaders: string[] = [];
  graduationArray: Array<any> = [];

  constructor(private playersService: PlayersService) {
    this.players = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.rosterForm = new FormGroup({
      name: new FormControl(null),
      graduationYear: new FormControl(null),
    });
    this.$playersSub = this.playersService.getPlayers().subscribe((result) => {
      const players: any[] = [];
      result.map((player) => {
        const p: any = player.payload.doc.data();
        const playerId = player.payload.doc.id;
        const playerInfo: Player = {
          id: playerId,
          name: p.name,
          graduationYear: p.graduationYear,
        };
        players.push(playerInfo);
      });
      this.players.data = players;
      this.graduationYears = this.groupBy(players, "graduationYear");
      this.graduationHeaders = Object.keys(this.graduationYears);
      this.graduationHeaders.map((year: string) => {
        const gradYear = year;
        const yearPlayers: any = [];
        players.map((player: Player) => {
          if (year === player.graduationYear?.toString()) {
            yearPlayers.push(player);
          }
        });
        this.graduationArray.push({ year: gradYear, players: yearPlayers });
      });
    });
    this.players.paginator = this.tableOnePaginator;
    this.players.sort = this.tableOneSort;
  }

  groupBy(objectArray: any, property: any) {
    return objectArray.reduce((acc: any, obj: any) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
    }, {});
  }

  ngOnDestroy() {
    this.$playersSub.unsubscribe();
  }

  save() {
    this.playersService.createPlayer(this.rosterForm.value);
    this.rosterForm.reset();
  }

  delete(element: any) {
    this.playersService.deletePlayer(element.id);
  }

  applyFilter(filterValue: string) {
    this.players.filter = filterValue.trim().toLowerCase();
  }
}
