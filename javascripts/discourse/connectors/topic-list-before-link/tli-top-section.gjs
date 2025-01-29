import Component from "@glimmer/component";
import avatar from "discourse/helpers/avatar";
import formatDate from "discourse/helpers/format-date";
import categoryLink from "discourse/helpers/category-link";
import i18n from "discourse-common/helpers/i18n";

export default class TliTopSection extends Component {
  
  get topic() {
    return this.args.outletArgs.topic;
  }

  <template>
    <div class="tli-top-section">
      <div class="tli-top-section__category">
        {{#unless this.topic.hideCategory}}
          {{#unless this.topic.isPinnedUncategorized}}
            {{categoryLink this.topic.category}}
          {{/unless}}
        {{/unless}}
      </div>
      <div class="tli-top-section__author">
        <a
          href={{this.topic.posters.[0].user.userPath}}
          data-user-card={{this.topic.posters.[0].user.username}}
        >
          <div class="topic-list-avatar">
            {{avatar
              this.topic.posters.[0].user
              avatarTemplatePath="user.avatar_template"
              usernamePath="user.username"
              namePath="user.name"
              imageSize="large"
            }}
            <div class="name-and-date">
              <span class="full-name-tlist">{{this.topic.posters.[0].user.name}}</span>
              <span class="username">{{this.topic.posters.[0].user.username}}</span>
              <span class="list-date">{{i18n (themePrefix "created_at")}} {{formatDate this.topic.createdAt format="tiny"}}</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </template>
}
