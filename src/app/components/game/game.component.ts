import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GamesService } from "app/services/games.service";
import { PlaysService } from "app/services/plays.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { GamePlay } from "app/models/gamePlay";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  gamePlaysArray!: MatTableDataSource<any>;
  displayedColumns1: string[] = ["play", "result", "delete"];
  @ViewChild("TableTwoPaginator", { static: true })
  tableTwoPaginator!: MatPaginator;

  playsArray!: MatTableDataSource<any>;
  displayedColumns2: string[] = ["play", "gameCount", "gameAvg", "seasonAvg"];
  @ViewChild("TableOnePaginator", { static: true })
  tableOnePaginator!: MatPaginator;
  @ViewChild("TableOneSort", { static: true }) tableOneSort!: MatSort;

  gameId: any;
  game: any;

  gameForm!: FormGroup;
  gamePlayForm!: FormGroup;

  selectPlays: Array<any> = [];

  runPlays: GamePlay[] = [];
  totalRushYards!: number;
  passPlays: GamePlay[] = [];
  totalPassYards!: number;
  totalYards!: number;
  avgYards!: string;
  runAvg!: number;
  passAvg!: number;

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService,
    private playsService: PlaysService
  ) {
    this.gameId = this.route.snapshot.paramMap.get("id");
    this.gamePlaysArray = new MatTableDataSource();
    this.playsArray = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.gamesService.getGame(this.gameId).subscribe((game) => {
      this.game = game.payload.data();
      this.gamePlaysArray.data = this.game.gamePlays;
      this.totalYards = this.gamePlaysArray.data
        .map((p) => p.result * 1)
        .reduce((acc, value) => acc + value, 0);
      this.avgYards = (
        this.totalYards / this.gamePlaysArray.data.length
      ).toFixed(2);
      this.gamePlaysArray.data.map((gamePlay: GamePlay) => {
        if (gamePlay.play.runPass === "Run") {
          this.runPlays.push(gamePlay);
        } else {
          this.passPlays.push(gamePlay);
        }
      });
      this.totalRushYards = this.runPlays
        .map((p) => p.result * 1)
        .reduce((acc, value) => acc + value, 0);
      this.totalPassYards = this.passPlays
        .map((p) => p.result * 1)
        .reduce((acc, value) => acc + value, 0);
      this.runAvg = this.totalRushYards / this.runPlays.length;
      this.passAvg = this.totalPassYards / this.passPlays.length;
    });
    this.playsService.getPlays().subscribe((result) => {
      result.map((play) => {
        this.selectPlays.push(play.payload.doc.data());
      });
      this.playsArray.data = this.selectPlays;
      this.playsArray.data.map((play) => {
        const playName = play.fullPlay;
        const gamePlays: Array<any> = [];
        this.gamePlaysArray.data.map((gamePlay) => {
          if (gamePlay.play.fullPlay === playName) {
            gamePlays.push(gamePlay);
          }
          if (gamePlays.length) {
            play.gameAvg =
              gamePlays
                .map((p) => p.result * 1)
                .reduce((acc, value) => acc + value, 0) / gamePlays.length;
            play.gameCount = gamePlays.length;
          }
        });
      });
    });
    this.gamePlayForm = new FormGroup({
      date: new FormControl(null),
      play: new FormControl(null, Validators.required),
      result: new FormControl(null, Validators.required),
    });
    this.gameForm = new FormGroup({
      team: new FormControl(null),
      date: new FormControl(null),
      score: new FormControl(null),
      location: new FormControl(null),
      outcome: new FormControl(null),
      gamePlays: new FormControl(),
    });
    this.gamePlaysArray.paginator = this.tableTwoPaginator;
    this.playsArray.paginator = this.tableOnePaginator;
    this.playsArray.sort = this.tableOneSort;
    console.log(this.playCats);
  }

  delete(element: any) {
    this.gamePlaysArray.data = this.gamePlaysArray.data.filter(function (obj) {
      return obj.date !== element.date;
    });
    this.gameForm.patchValue({
      team: this.game.team,
      date: this.game.date,
      score: this.game.score,
      location: this.game.location,
      outcome: this.game.outcome,
      gamePlays: this.gamePlaysArray.data,
    });
    this.gamesService.updateGame(this.gameId, this.gameForm.value);
  }

  saveGamePlay() {
    this.runPlays = [];
    this.passPlays = [];
    this.gamePlayForm.patchValue({
      date: new Date(),
    });
    this.gamePlaysArray.data.push(this.gamePlayForm.value);
    this.gameForm.patchValue({
      team: this.game.team,
      date: this.game.date,
      score: this.game.score,
      location: this.game.location,
      outcome: this.game.outcome,
      gamePlays: this.gamePlaysArray.data,
    });
    this.gamesService.updateGame(this.gameId, this.gameForm.value);
    this.gamePlayForm.reset();
    this.playsArray.data = this.selectPlays;
    this.playsArray.data.map((play) => {
      const playName = play.fullPlay;
      const gamePlays: Array<any> = [];
      this.gamePlaysArray.data.map((gamePlay) => {
        if (gamePlay.play.fullPlay === playName) {
          gamePlays.push(gamePlay);
        }
        if (gamePlays.length) {
          play.gameAvg =
            gamePlays
              .map((p) => p.result * 1)
              .reduce((acc, value) => acc + value, 0) / gamePlays.length;
          play.gameCount = gamePlays.length;
        }
      });
    });
  }

  applyFilterOne(filterValue: string) {
    this.playsArray.filter = filterValue.trim().toLowerCase();
  }
}
