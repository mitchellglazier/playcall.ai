import { Component, OnInit } from "@angular/core";
import { ProfileService } from "app/services/profile.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  currentProfile!: any;
  profileUserKey = "JWaseaRYNTfFX31oH00L";

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile(this.profileUserKey).subscribe((profile) => {
      this.currentProfile = profile.payload.data();
    });
  }
}
