import { get } from "@ember/helper";
import UserLink from "discourse/components/user-link";
import avatar from "discourse/helpers/avatar";
import formatDate from "discourse/helpers/format-date";
import categoryLink from "discourse/helpers/category-link";
import i18n from "discourse-common/helpers/i18n";
import FkbTopicListSection from "./fkb-topic-list-section";

export default class FkbTopicHeader extends FkbTopicListSection {
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
              <time
                class="list-date"
                datetime={{this.topic.createdAt}}
              >
                {{i18n (themePrefix "created_at")}}
                {{formatDate this.topic.createdAt format="tiny"}}
              </time>
            </div>
          </div>
        </UserLink>
      </div>
    </div>
  </template>
}
