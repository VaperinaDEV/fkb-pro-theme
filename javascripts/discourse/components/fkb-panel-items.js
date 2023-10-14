import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class FKBPanel extends Component {
  @tracked fkbPanelItems = JSON.parse(settings.fkb_panel_items);
}
