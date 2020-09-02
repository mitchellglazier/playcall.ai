import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { PlaysService } from "app/services/plays.service";
import { SettingsService } from "app/services/settings.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Play } from "app/models/play";
import { Subscription } from "rxjs";

@Component({
  selector: "app-playbook",
  templateUrl: "./playbook.component.html",
  styleUrls: ["./playbook.component.css"],
})
export class PlaybookComponent implements OnInit, OnDestroy {
  plays!: MatTableDataSource<any>;
  @ViewChild("TableOnePaginator", { static: true })
  tableOnePaginator!: MatPaginator;
  @ViewChild("TableOneSort", { static: true }) tableOneSort!: MatSort;

  displayedColumns: string[] = [
    "formation",
    "name",
    "playCat",
    "runPass",
    "delete",
  ];
  dataSource = [];

  $playsSub!: Subscription;
  $settingSub!: Subscription;

  playForm!: FormGroup;
  selectPlays: Array<any> = [];
  currentSetting!: any;

  posArray: Array<any> = [];
  catArray: Array<any> = [];
  formationsArray: Array<any> = [];

  settingUserKey = "UAK9rOvMQ854IgMQm8Do";

  constructor(
    private playsService: PlaysService,
    private settingsService: SettingsService
  ) {
    this.plays = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.playForm = new FormGroup({
      formation: new FormControl(null),
      name: new FormControl(null),
      playCat: new FormControl(null),
      primaryPos: new FormControl(null),
      runPass: new FormControl(null),
    });
    this.$playsSub = this.playsService.getPlays().subscribe((result) => {
      result.map((play) => {
        const playId = play.payload.doc.id;
        const p: any = play.payload.doc.data();
        const playInfo = {
          id: playId,
          name: p.name,
          formation: p.formation,
          playCat: p.playCat,
          runPass: p.runPass,
          fullPlay: p.fullPlay,
          primaryPos: p.primaryPos,
        };
        this.selectPlays.push(playInfo);
      });
      this.plays.data = this.selectPlays;
      this.plays.data.sort((a, b) => {
        const x = a.fullPlay.toLocaleString();
        const y = b.fullPlay.toLocaleString();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        return 0;
      });
    });
    this.$settingSub = this.settingsService
      .getSetting(this.settingUserKey)
      .subscribe((setting) => {
        this.currentSetting = setting.payload.data();
        this.catArray = this.currentSetting.playCats;
        this.posArray = this.currentSetting.positions;
        this.formationsArray = this.currentSetting.formations;
      });
    this.plays.paginator = this.tableOnePaginator;
    this.plays.sort = this.tableOneSort;
  }

  ngOnDestroy() {
    this.$playsSub.unsubscribe();
    this.$settingSub.unsubscribe();
  }

  save() {
    this.playsService.createPlay(this.playForm.value);
    this.playForm.reset();
  }

  delete(element: any) {
    this.playsService.deletePlay(element.id);
  }

  applyFilterOne(filterValue: string) {
    this.plays.filter = filterValue.trim().toLowerCase();
  }
}
