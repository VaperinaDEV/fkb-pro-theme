import Component from "@glimmer/component";
import iconOrImage from "discourse/helpers/icon-or-image";
import { i18n } from "discourse-i18n";

export default class FkbPanelBadges extends Component {
  <template>
    {{#if settings.fkb_panel_show_badges}}
      {{#if @userCardDetails}}
        <div class="badges">
          {{#each @userCardDetails.badges as |b|}}
            <a href="/badges/{{b.id}}/{{b.slug}}">
              <span
                class="user-badge badge-type-{{b.badge_type_id}}"
                title={{b.description}}
                data-badge-name={{b.name}}
              >
                {{iconOrImage b}}
                <span class="badge-display-name">{{b.name}}</span>
                {{#if b.multiple_grant}}
                  <span class="count">&nbsp;(&times;{{b.grant_count}})</span>
                {{/if}}
              </span>
            </a>
          {{/each}}
          <a href="/u/{{@user.username}}/badges">
            <span class="user-badge">
              <span class="count">
                {{i18n (themePrefix "sidebar.all_badges")}}
                ({{@userCardDetails.user.badge_count}})
              </span>
            </span>
          </a>
        </div>
      {{/if}}
    {{/if}}
  </template>
}
