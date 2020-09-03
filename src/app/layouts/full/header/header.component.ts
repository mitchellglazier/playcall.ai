import { Component } from "@angular/core";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [],
})
export class AppHeaderComponent {
  user!: any;
  constructor(private authService: AuthService) {
    this.user = this.authService.userData;
  }

  signOut() {
    this.authService.SignOut();
  }
}
