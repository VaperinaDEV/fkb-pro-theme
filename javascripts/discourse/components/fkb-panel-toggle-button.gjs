import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";

export default class FKBPanelToggleButton extends Component {
  @service fkbPanelState;

  @action
  toggle() {
    this.fkbPanelState.toggle();
  }

  <template>
    <DButton
      @class="btn-default btn no-text btn-icon fkb-panel-toggle"
      @action={{this.toggle}}
      @icon={{if this.fkbPanelState.hidden "chevron-left" "chevron-right"}}
      @ariaLabel={{if
        this.fkbPanelState.hidden
        (themePrefix "sidebar.show_panel")
        (themePrefix "sidebar.hide_panel")
      }}
      @title={{if
        this.fkbPanelState.hidden
        (themePrefix "sidebar.show_panel")
        (themePrefix "sidebar.hide_panel")
      }}
      @ariaExpanded={{this.fkbPanelState.expanded}}
    />
  </template>
}
