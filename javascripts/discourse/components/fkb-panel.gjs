import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { htmlSafe } from "@ember/template";
import { concat } from "@ember/helper";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import didUpdate from "@ember/render-modifiers/modifiers/did-update";
import { service } from "@ember/service";
import { getURLWithCDN } from "discourse/lib/get-url";
import ConditionalLoadingSpinner from "discourse/components/conditional-loading-spinner";
import { ajax } from "discourse/lib/ajax";
import FkbPanelItems from "./fkb-panel-items";
import RightSidebarBlocksBelow from "./right-sidebar-blocks-below";
import FkbPanelUser from "./fkb-panel-user";
import FkbPanelStats from "./fkb-panel-stats";
import FkbPanelBadges from "./fkb-panel-badges";
import FkbPanelVisitor from "./fkb-panel-visitor";
import FkbPanelToggleButton from "./fkb-panel-toggle-button";

export default class FkbPanel extends Component {
  @service currentUser;
  @service site;
  @service fkbCache;

  @tracked loading = false;

  @action
  async autoFetch() {
    this.fkbCache.activateUser(this.currentUser?.id);

    if (
      this.currentUser &&
      (!this.fkbCache.userDetails || !this.fkbCache.userCardDetails) &&
      !this.loading
    ) {
      await this.fetchUserDetails();
    }
  }

  @action
  async fetchUserDetails() {
    if (!this.currentUser || this.loading) return;

    this.fkbCache.activateUser(this.currentUser.id);
    this.fkbCache.checkExpiry();

    if (this.fkbCache.userDetails && this.fkbCache.userCardDetails) {
      return;
    }

    this.loading = true;

    try {
      const [summary, card] = await Promise.all([
        ajax(`/u/${this.currentUser.username}/summary.json`),
        ajax(`/u/${this.currentUser.username}/card.json`),
      ]);

      this.fkbCache.save("userDetails", summary);
      this.fkbCache.save("userCardDetails", card);
    } finally {
      this.loading = false;
    }
  }

  get currentUserId() {
    return this.currentUser?.id;
  }

  get userDetails() {
    return this.fkbCache.userDetails;
  }

  get userCardDetails() {
    return this.fkbCache.userCardDetails;
  }
  
  get hasBackgroundImage() {
    return !!this.userCardDetails?.user?.card_background_upload_url;
  }

  get backgroundImageURL() {
    return getURLWithCDN(
      this.userCardDetails?.user?.card_background_upload_url || ""
    );
  }

  <template>
    {{#unless this.site.mobileView}}
      <div
        class="fkb-panel-sidebar"
        {{didInsert this.fetchUserDetails}}
        {{didUpdate
          this.autoFetch
          this.currentUserId
          this.fkbCache.userDetails
          this.fkbCache.userCardDetails
        }}
      >
        <div class="fkb-panel">
          {{#if this.currentUser}}
            <ConditionalLoadingSpinner @condition={{this.loading}}>
              <div
                class="fkb-panel-top {{if this.hasBackgroundImage "has-cover"}}"
                style={{if this.hasBackgroundImage (htmlSafe (concat "background-image: url('" this.backgroundImageURL "')"))}}
              >
                <div class="fkb-panel-contents">
                  <div class="fkb-panel-contents-top">
                    <FkbPanelUser @user={{this.currentUser}} />
                  </div>
                  <div class="fkb-panel-contents-stats">
                    <FkbPanelStats
                      @user={{this.currentUser}}
                      @userDetails={{this.userDetails}}
                    />
                    <FkbPanelBadges
                      @user={{this.currentUser}}
                      @userCardDetails={{this.userCardDetails}}
                    />
                  </div>
                </div>
              </div>
              <div class="fkb-panel-contents-bottom">
                <FkbPanelItems />
              </div>
            </ConditionalLoadingSpinner>
          {{/if}}
      
          {{#unless this.currentUser}}
            <FkbPanelVisitor @description={{settings.custom_sidebar_description}} />
          {{/unless}}
        </div>
  
        <RightSidebarBlocksBelow />
      </div>
  
      <div class="fkb-panel-toggle-button">
        <FkbPanelToggleButton />
      </div>
    {{/unless}}
  </template>
}
