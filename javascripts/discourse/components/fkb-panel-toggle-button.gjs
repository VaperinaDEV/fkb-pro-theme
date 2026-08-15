import Component from "@glimmer/component";
import { action } from "@ember/object";
import DButton from "discourse/components/d-button";

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

  <template>
    <DButton
      @class="btn-default btn no-text btn-icon fkb-panel-toggle"
      @action={{this.toggle}}
      @icon="chevron-right"
    />
  </template>
}
