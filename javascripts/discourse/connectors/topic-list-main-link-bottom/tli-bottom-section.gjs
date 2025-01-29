import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";
import { gt } from "truth-helpers";
import concatClass from "discourse/helpers/concat-class";
import icon from "discourse/helpers/d-icon";
import number from "discourse/helpers/number";
import avatar from "discourse/helpers/avatar";
import formatDate from "discourse/helpers/format-date";
import i18n from "discourse-common/helpers/i18n";

export default class TliTopSection extends Component {
  
  get topic() {
    return this.args.outletArgs.topic;
  }

  <template>
    <div class="tli-bottom-section">
      {{#if (gt this.topic.like_count 0)}}
        <a class="likes likes-tlist" href={{this.topic.summaryUrl}}>
          {{number this.topic.like_count}}
          {{icon "heart"}}
        </a>
      {{/if}}

      <a class={{concatClass "num views" this.topic.viewsHeat}}>
        {{number this.topic.views numberKey="views_long"}} {{icon "far-eye"}}
      </a>

      <a
        href={{this.topic.lastPostUrl}}
        data-user-card={{this.topic.last_poster_username}}
        class="latest-poster-tlist"
      >
        {{avatar
          topic.lastPosterUser
          avatarTemplatePath="user.avatar_template"
          usernamePath="user.username"
          namePath="user.name"
          imageSize="tiny"
        }}
      </a>

      <a 
        class={{concatClass "latest-activity-tlist" this.topic.view.likesHeat}}
        href="{{this.topic.lastPostUrl}}"
       >
        {{formatDate this.topic.bumpedAt format="tiny" noTitle="true"~}} {{icon "clock-rotate-left"}}
      </a>

      <a href class={{concatClass "posts-map badge-posts" this.topic.view.likesHeat}} aria-label={{this.topic.view.title}}>
        {{number this.topic.replyCount noTitle="true"}} {{d-icon "far-comment"}}
      </a>
    </div>
  </template>
}
