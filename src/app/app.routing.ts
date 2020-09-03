import { Routes } from "@angular/router";

import { FullComponent } from "./layouts/full/full.component";
import { LoginComponent } from "./login/login.component";

import { AuthGuard } from "./services/auth.guard";

export const AppRoutes: Routes = [
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "",
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "/dashboard",
        pathMatch: "full",
      },
      {
        path: "",
        loadChildren: () =>
          import("./components/material.module").then(
            (m) => m.MaterialComponentsModule
          ),
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];
