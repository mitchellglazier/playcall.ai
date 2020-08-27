import { Routes } from "@angular/router";

import { RosterComponent } from "./roster/roster.component";
import { PlaybookComponent } from "./playbook/playbook.component";
import { TeamsComponent } from "./teams/teams.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { GameComponent } from "./game/game.component";
import { PlayComponent } from "./play/play.component";
import { TeamComponent } from "./team/team.component";
import { PlayerComponent } from "./player/player.component";
import { ProfileComponent } from "./profile/profile.component";
import { SettingsComponent } from "./settings/settings.component";

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
  {
    path: "profile",
    component: ProfileComponent,
  },
  {
    path: "settings",
    component: SettingsComponent,
  },
  {
    path: "game/:id",
    component: GameComponent,
  },
  {
    path: "play/:id",
    component: PlayComponent,
  },
  {
    path: "team/:id",
    component: TeamComponent,
  },
  {
    path: "player/:id",
    component: PlayerComponent,
  },
];
