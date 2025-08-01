import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { htmlSafe } from "@ember/template";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { service } from "@ember/service";
import { getURLWithCDN } from "discourse/lib/get-url";
import ConditionalLoadingSpinner from "discourse/components/conditional-loading-spinner";
import avatar from "discourse/helpers/avatar";
import iconOrImage from "discourse/helpers/icon-or-image";
import DButton from "discourse/components/d-button";
import UserStat from "discourse/components/user-stat";
import concatClass from "discourse/helpers/concat-class";
import replaceEmoji from "discourse/helpers/replace-emoji";
import routeAction from "discourse/helpers/route-action";
import { ajax } from "discourse/lib/ajax";
import { i18n } from "discourse-i18n";
import FkbPanelItems from "./fkb-panel-items";
import RightSidebarBlocksBelow from "./right-sidebar-blocks-below";

export default class FkbPanel extends Component {
  @service currentUser;
  @service site;

  @tracked userDetails;
  @tracked userCardDetails;
  @tracked loading;

  @action
  async fetchUserDetails() {
    this.loading = true;
  
    if (!this.currentUser) {
      this.loading = false;
      return;
    }
  
    try {
      const [summaryResponse, cardResponse] = await Promise.all([
        ajax(`/u/${this.currentUser.username}/summary.json`),
        ajax(`/u/${this.currentUser.username}/card.json`)
      ]);
  
      this.userDetails = summaryResponse;
      this.userCardDetails = cardResponse;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching user details or card:", error);
    } finally {
      this.loading = false;
    }
  }

  get fkbPanelCover() {
    if (!this.userCardDetails?.user?.card_background_upload_url) {
      return null;
    }
    return `background-image: url("${getURLWithCDN(this.userCardDetails.user.card_background_upload_url)}")`;
  }

  <template>
    <div class="fkb-panel-sidebar" {{didInsert this.fetchUserDetails}}>
      <div class="fkb-panel">
        {{#if this.currentUser}}
          <ConditionalLoadingSpinner @condition={{this.loading}}>
            <div class="fkb-panel-top" style={{htmlSafe this.fkbPanelCover}}>
              <div class="fkb-panel-contents">
                <div class="fkb-panel-contents-top">
                  <div class="fkb-avatar">
                    <a href="/u/{{this.currentUser.username}}">
                      {{avatar this.currentUser imageSize="medium"}}
                    </a>
                    <a href="/u/{{this.currentUser.username}}" class="fkb-user-names">
                      <span class="fkb-name">
                        {{this.currentUser.name}}
                      </span>
                      <span class="fkb-username">
                        {{this.currentUser.username}}
                      </span>
                    </a>              
                  </div>
                </div>
                <div class="fkb-panel-contents-stats">
                  <div class="stats">
                    <UserStat @value={{this.userDetails.user_summary.likes_received}} @icon="heart" @label="user.summary.likes_received" /> 
                    <a href="/u/{{this.currentUser}}/activity/likes-given">
                      <UserStat @value={{this.userDetails.user_summary.likes_given}} @icon="heart" @label="user.summary.likes_given" />
                    </a>
                    {{#if settings.fkb_panel_show_solutions}}
                      <a href="/u/{{this.currentUser}}/activity/solved">
                        <UserStat @value={{this.userDetails.user_summary.solved_count}} @icon="square-check" @label="solved.solution_summary.other" />
                      </a>
                    {{/if}}
                    <a href="/u/{{this.currentUser}}/activity/topics">
                      <UserStat @value={{this.userDetails.user_summary.topic_count}} @label="user.summary.topic_count" />
                    </a>
                    <a href="/u/{{this.currentUser}}/activity/replies">
                      <UserStat @value={{this.userDetails.user_summary.post_count}} @label="user.summary.post_count" />
                    </a>
                  </div>
                  {{#if settings.fkb_panel_show_badges}}
                  {{#if this.userDetails.badges}}
                    <div class="badges">
                      {{#each this.userCardDetails.badges as |b|}}
                        <a href="/badges/{{b.id}}/{{b.slug}}">
                          <span class="user-badge badge-type-{{b.badge_type_id}}" title={{b.description}} data-badge-name={{b.name}}>
                            {{iconOrImage b}}
                            <span class="badge-display-name">{{b.name}}</span>
                            {{#if b.multiple_grant}}
                              <span class="count">&nbsp;(&times;{{b.grant_count}})</span>
                            {{/if}}
                            {{yield}}
                          </span>
                        </a>
                      {{/each}}
                      <a href="/u/{{this.currentUser}}/badges">
                        <span class="user-badge">
                          <span class="count">{{i18n (themePrefix "sidebar.all_badges")}} ({{this.userCardDetails.user.badge_count}})</span>
                        </span>
                      </a>
                    </div>
                  {{/if}}
                  {{/if}}
                </div>
              </div>
            </div>
            <div class="fkb-panel-contents-bottom">
              <FkbPanelItems />
            </div>
          </ConditionalLoadingSpinner>
        {{/if}}
    
        {{#unless this.currentUser}}
          <div class="visitor">
            <h2>{{i18n (themePrefix "sidebar.welcome")}}</h2>
            {{#if settings.custom_sidebar_enabled}}
              {{#if settings.custom_sidebar_image}}
                <img src="{{settings.custom_sidebar_image}}"/>
              {{/if}}
              <p>{{{settings.custom_sidebar_description}}}</p>
              {{else}}
              {{replaceEmoji (i18n "signup_cta.value_prop")}}
            {{/if}}
            <DButton @class="btn-primary sign-up-button" @action={{routeAction "showCreateAccount"}} @label="sign_up" />
          </div>
        {{/unless}}
      </div>
      <RightSidebarBlocksBelow />
    </div>
  </template>
}
