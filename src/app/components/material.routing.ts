import { Routes } from "@angular/router";

import { RosterComponent } from "./roster/roster.component";
import { PlaybookComponent } from "./playbook/playbook.component";
import { TeamsComponent } from "./teams/teams.component";
import { ScheduleComponent } from "./schedule/schedule.component";

export const MaterialRoutes: Routes = [
  {
    path: "roster",
    component: RosterComponent,
  },
  {
    path: "playbook",
    component: PlaybookComponent,
  },
  {
    path: "opposition",
    component: TeamsComponent,
  },
  {
    path: "schedule",
    component: ScheduleComponent,
  },
];
