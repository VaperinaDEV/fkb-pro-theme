import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class FKBPanelHideButton extends Component {
  
  @action
  toggle() {
    const fkbPanelHidden = document.body.classList.contains("fkb-panel-hidden");
    if (fkbPanelHidden) {
      return localStorage.removeItem("fkb_panel_hidden", true), document.body.classList.remove("fkb-panel-hidden");
    } else {
      return localStorage.setItem("fkb_panel_hidden", true), document.body.classList.add("fkb-panel-hidden");
    }
  } 
}
