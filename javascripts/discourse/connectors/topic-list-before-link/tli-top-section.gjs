import Component from "@glimmer/component";
import { get } from "@ember/helper";
import UserLink from "discourse/components/user-link";
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
        <UserLink @user={{get this.topic.posters "0.user"}}>
          <div class="topic-list-avatar">          
            {{avatar (get this.topic.posters "0.user") imageSize="large"}}
            <div class="name-and-date">
              <span class="full-name-tlist">{{this.topic.creator.name}}</span>
              <span class="username">{{this.topic.creator.username}}</span>
              <span class="list-date">{{i18n (themePrefix "created_at")}} {{formatDate this.topic.createdAt format="tiny"}}</span>
            </div>
          </div>
        </UserLink>
      </div>
    </div>
  </template>
}
