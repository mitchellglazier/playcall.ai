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

  playCats = [
    { name: "Sweep", value: "Sweep" },
    { name: "Trap", value: "Trap" },
    { name: "Boot", value: "Boot" },
    { name: "Wedge", value: "Wedge" },
    { name: "Pop Pass", value: "Pop Pass" },
    { name: "Cross Block", value: "Cross Block" },
    { name: "Counter", value: "Counter" },
    { name: "Belly", value: "Belly" },
    { name: "Down", value: "Down" },
    { name: "Keep Pass", value: "Keep Pass" },
    { name: "Reverse", value: "Reverse" },
    { name: "Power", value: "Power" },
    { name: "Pass", value: "Pass" },
    { name: "Special", value: "Special" },
    { name: "Screen", value: "Screen" },
  ];

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
