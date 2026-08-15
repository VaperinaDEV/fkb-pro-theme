import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";
import replaceEmoji from "discourse/helpers/replace-emoji";
import DButton from "discourse/components/d-button";
import routeAction from "discourse/helpers/route-action";
import { i18n } from "discourse-i18n";

export default class FkbPanelVisitor extends Component {
  get customDescription() {
    return htmlSafe(this.args.description || "");
  }

  <template>
    <div class="visitor">
      <h2>{{i18n (themePrefix "sidebar.welcome")}}</h2>
      {{#if settings.custom_sidebar_enabled}}
        {{#if settings.custom_sidebar_image}}
          <img src="{{settings.custom_sidebar_image}}" alt="" />
        {{/if}}
        <p>{{this.customDescription}}</p>
      {{else}}
        {{replaceEmoji (i18n "signup_cta.value_prop")}}
      {{/if}}
      <DButton
        @class="btn-primary sign-up-button"
        @action={{routeAction "showCreateAccount"}}
        @label="sign_up"
      />
    </div>
  </template>
}
