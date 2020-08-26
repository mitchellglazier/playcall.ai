import "hammerjs";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";

import { DemoMaterialModule } from "../demo-material-module";
import { CdkTableModule } from "@angular/cdk/table";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { MaterialRoutes } from "./material.routing";

import { PlaybookComponent } from "./playbook/playbook.component";
import { TeamsComponent } from "./teams/teams.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { RosterComponent } from "./roster/roster.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    DemoMaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule,
  ],
  providers: [],
  entryComponents: [],
  declarations: [
    RosterComponent,
    PlaybookComponent,
    TeamsComponent,
    ScheduleComponent,
  ],
})
export class MaterialComponentsModule {}