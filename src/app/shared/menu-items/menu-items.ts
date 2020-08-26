import { Injectable } from "@angular/core";

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: "dashboard", name: "Dashboard", type: "link", icon: "av_timer" },
  { state: "roster", type: "link", name: "Roster", icon: "view_headline" },
  { state: "playbook", type: "link", name: "Play Book", icon: "view_comfy" },
  {
    state: "opposition",
    type: "link",
    name: "Opposition List",
    icon: "view_list",
  },
  { state: "schedule", type: "link", name: "Schedule", icon: "web" },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
