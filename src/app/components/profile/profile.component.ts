import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ProfileService } from "app/services/profile.service";
import { Team } from "app/models/team";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  coachesForm!: FormGroup;
  coachesArray: Array<any> = [];

  currentProfile!: any;
  profileUserKey = "JWaseaRYNTfFX31oH00L";

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      mascot: new FormControl(null),
      location: new FormControl(null),
      primaryColor: new FormControl(null),
      currentCoach: new FormControl(null),
      coaches: new FormControl([]),
    });
    this.coachesForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      position: new FormControl(null),
    });
    this.profileService.getProfile(this.profileUserKey).subscribe((profile) => {
      this.currentProfile = profile.payload.data();
      this.coachesArray = this.currentProfile.coaches;
      if (!!profile && !!this.currentProfile) {
        this.profileForm.patchValue({
          name: this.currentProfile.name,
          mascot: this.currentProfile.mascot,
          location: this.currentProfile.location,
          primaryColor: this.currentProfile.primaryColor,
          coaches: this.currentProfile.coaches,
          currentCoach: this.currentProfile.currentCoach,
        });
      }
    });
  }

  save() {
    if (!!this.currentProfile) {
      this.profileService.updateProfile(
        this.profileUserKey,
        this.profileForm.value
      );
    } else {
      this.profileService.createProfile(this.profileForm.value);
    }
  }

  saveCoach() {
    this.coachesArray.push(this.coachesForm.value);
    this.profileForm.patchValue({
      coaches: this.coachesArray,
    });
    this.profileService.updateProfile(
      this.profileUserKey,
      this.profileForm.value
    );
    this.coachesForm.reset();
  }

  deleteCoach(coach: any) {
    this.coachesArray = this.coachesArray.filter(function (obj) {
      return obj.name !== coach.name;
    });
    this.profileForm.patchValue({
      coaches: this.coachesArray,
    });
    this.profileService.updateProfile(
      this.profileUserKey,
      this.profileForm.value
    );
  }
}
