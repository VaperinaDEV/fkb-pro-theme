import Component from "@glimmer/component";
import { getOwner } from "@ember/owner";

export default class RightSidebarBlocksBelow extends Component {
  get rightSidebarBlocks() {
    return getOwner(this).resolveRegistration("component:right-sidebar-blocks");
  }

  <template>
    {{#if settings.right_sidebar_below_fkb_panel}}
      {{#if this.rightSidebarBlocks}}
        <div class="tc-right-sidebar">
          {{#let this.rightSidebarBlocks as |RightSidebarBlocks|}}
            <RightSidebarBlocks />
          {{/let}}
        </div>
      {{/if}}
    {{/if}}
  </template>
}
