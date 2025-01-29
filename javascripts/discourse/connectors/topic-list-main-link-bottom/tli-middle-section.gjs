import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";
import { gt } from "truth-helpers";
import concatClass from "discourse/helpers/concat-class";
import icon from "discourse/helpers/d-icon";
import number from "discourse/helpers/number";
import UserLink from "discourse/components/user-link";
import avatar from "discourse/helpers/avatar";
import formatDate from "discourse/helpers/format-date";
import replaceEmoji from "discourse/helpers/replace-emoji";
import i18n from "discourse-common/helpers/i18n";
import discourseTags from "discourse/helpers/discourse-tags";

export default class TliMiddleSection extends Component {
  
  get topic() {
    return this.args.outletArgs.topic;
  }

  get topicBackgroundStyle() {
    return htmlSafe(`background-image: url(${this.topic.image_url})`);
  }

  <template>
    {{#unless settings.disable_topic_list_modification}}
      <div class="tli-middle-section">
        {{#if this.topic.hasExcerpt}}
          <div class="topic-excerpt">
            {{replaceEmoji (htmlSafe this.topic.excerpt)}}
            <a href={{this.topic.firstPostUrl}} class="topic-excerpt-more">
              {{i18n "js.read_more"}}
            </a>
          </div>
        {{/if}}
        {{#if this.topic.image_url}}
          <a href="{{this.topic.lastUnreadUrl}}">
            <div class="topic-image">
              {{#if settings.topic_image_backdrop}}
                <div class="topic-image__backdrop" style={{this.topicBackgroundStyle}} loading="lazy"></div>
              {{/if}}
              <img src="{{this.topic.image_url}}" class="topic-image__img" loading="lazy">
            </div>
          </a>
        {{/if}}
        {{discourseTags this.topic mode="list" tagsForUser=@tagsForUser}}
      </div>
  
      <div class="tli-bottom-section">
        {{#if (gt this.topic.like_count 0)}}
          <a class="likes likes-tlist" href="{{this.topic.lastUnreadUrl}}">
            {{number this.topic.like_count}}
            {{icon "heart"}}
          </a>
        {{/if}}
  
        <a href="{{this.topic.lastUnreadUrl}}" class={{concatClass "num views" this.topic.viewsHeat}}>
          {{number this.topic.views numberKey="views_long"}} {{icon "far-eye"}}
        </a>
  
        <UserLink
          @user={{this.topic.lastPosterUser}}
          class="latest-poster-tlist"
        >
          {{avatar this.topic.lastPosterUser imageSize="tiny"}}
        </UserLink>
  
        <a 
          class={{concatClass "latest-activity-tlist" this.topic.view.likesHeat}}
          href="{{this.topic.lastPostUrl}}"
         >
          {{formatDate this.topic.bumpedAt format="tiny" noTitle="true"~}} {{icon "clock-rotate-left"}}
        </a>
  
        <a href="{{this.topic.lastUnreadUrl}}" class={{concatClass "posts-map badge-posts" this.topic.view.likesHeat}} aria-label={{this.topic.view.title}}>
          {{number this.topic.replyCount noTitle="true"}} {{icon "far-comment"}}
        </a>
      </div>
    {{/unless}}
  </template>
}
