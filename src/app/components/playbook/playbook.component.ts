import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { PlaysService } from "app/services/plays.service";

@Component({
  selector: "app-playbook",
  templateUrl: "./playbook.component.html",
  styleUrls: ["./playbook.component.css"],
})
export class PlaybookComponent implements OnInit {
  displayedColumns: string[] = [
    "formation",
    "name",
    "playCat",
    "runPass",
    "delete",
  ];
  dataSource = [];
  playForm!: FormGroup;
  plays!: Array<any>;

  constructor(private playsService: PlaysService) {}

  ngOnInit(): void {
    this.playForm = new FormGroup({
      formation: new FormControl(null),
      name: new FormControl(null),
      playCat: new FormControl(null),
      runPass: new FormControl(null),
    });
    this.playsService.getPlays().subscribe((result) => {
      this.plays = result;
    });
  }

  save() {
    this.playsService.createPlay(this.playForm.value);
    this.playForm.reset();
  }

  delete(element: any) {
    this.playsService.deletePlay(element.payload.doc.id);
  }
}
