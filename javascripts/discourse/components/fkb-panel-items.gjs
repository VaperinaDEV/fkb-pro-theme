import Component from "@glimmer/component";
import DButton from "discourse/components/d-button";

export default class FKBPanel extends Component {
  
  get fkbPanelItems() {
    return settings.fkb_panel_items;
  }
  
  <template>
    {{#each this.fkbPanelItems as |fi|}}
      <DButton
        @translatedTitle={{fi.title}}
        @class="fkb-link btn-default btn no-text btn-icon"
        @href={{fi.link}}
        @icon={{fi.icon}}
      />
    {{/each}}
  </template>
}
