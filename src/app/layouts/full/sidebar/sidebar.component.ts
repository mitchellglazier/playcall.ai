import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { MenuItems } from "../../../shared/menu-items/menu-items";
import { ProfileService } from "app/services/profile.service";
import { FormGroup, FormControl } from "@angular/forms";
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: [],
})
export class AppSidebarComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  profileForm!: FormGroup;

  currentProfile!: any;
  profileUserKey = "JWaseaRYNTfFX31oH00L";

  coachesArray: Array<any> = [];

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private profileService: ProfileService
  ) {
    this.mobileQuery = media.matchMedia("(min-width: 768px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl(null),
      mascot: new FormControl(null),
      location: new FormControl(null),
      primaryColor: new FormControl(null),
      currentCoach: new FormControl(null),
      coaches: new FormControl([]),
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

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  setCoach(coach: any) {
    this.profileForm.patchValue({
      currentCoach: coach,
    });
    this.profileService.updateProfile(
      this.profileUserKey,
      this.profileForm.value
    );
  }
}
