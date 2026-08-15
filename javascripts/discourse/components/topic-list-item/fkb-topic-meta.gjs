import { gt } from "truth-helpers";
import icon from "discourse/helpers/d-icon";
import number from "discourse/helpers/number";
import UserLink from "discourse/components/user-link";
import avatar from "discourse/helpers/avatar";
import formatDate from "discourse/helpers/format-date";
import FkbTopicListSection from "./fkb-topic-list-section";

export default class FkbTopicMeta extends FkbTopicListSection {
  <template>
    <div class="tli-bottom-section">
      {{#if (gt this.topic.like_count 0)}}
        <a href={{this.topic.lastUnreadUrl}} class="likes likes-tlist">
          {{number this.topic.like_count}}
          {{icon "heart"}}
        </a>
      {{/if}}

      <a
        href={{this.topic.lastUnreadUrl}}
        class="num views"
      >
        {{number this.topic.views numberKey="views_long"}}
        {{icon "far-eye"}}
      </a>

      <UserLink
        @user={{this.topic.lastPosterUser}}
        class="latest-poster-tlist"
      >
        {{avatar this.topic.lastPosterUser imageSize="tiny"}}
      </UserLink>

      <a
        href={{this.topic.lastPostUrl}}
        class="latest-activity-tlist"
      >
        <time datetime={{this.topic.bumpedAt}}>
          {{formatDate this.topic.bumpedAt format="tiny" noTitle="true"}}
        </time>
        {{icon "clock-rotate-left"}}
      </a>

      <a
        href={{this.topic.lastUnreadUrl}}
        class="posts-map badge-posts"
      >
        {{number this.topic.replyCount noTitle="true"}}
        {{icon "far-comment"}}
      </a>
    </div>
  </template>
}
