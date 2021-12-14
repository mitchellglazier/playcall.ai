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
    "primaryPos",
    "direction",
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
      Direction: new FormControl(null),
    });
    this.$playsSub = this.playsService.getPlays().subscribe((plays: Play[]) => {
      this.plays.data = plays;
    });
    this.$settingSub = this.settingsService
      .getSetting(this.settingUserKey)
      .subscribe((setting) => {
        this.currentSetting = setting;
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
