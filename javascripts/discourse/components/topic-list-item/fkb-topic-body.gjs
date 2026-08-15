import { htmlSafe } from "@ember/template";
import dirSpan from "discourse/helpers/dir-span";
import i18n from "discourse-common/helpers/i18n";
import discourseTags from "discourse/helpers/discourse-tags";
import FkbTopicListSection from "./fkb-topic-list-section";
import FkbTopicMeta from "./fkb-topic-meta";

export default class FkbTopicBody extends FkbTopicListSection {
  get topicBackgroundStyle() {
    return htmlSafe(`background-image: url(${this.topic.image_url})`);
  }

  <template>
    <div class="tli-middle-section">
      {{#if this.topic.hasExcerpt}}
        <div class="topic-excerpt">
          <a href={{this.topic.url}} class="topic-excerpt-link">
            {{dirSpan this.topic.escapedExcerpt htmlSafe="true"}}
            {{#if this.topic.excerptTruncated}}
              <span class="topic-excerpt-more">{{i18n "read_more"}}</span>
            {{/if}}
          </a>
        </div>
      {{/if}}

      {{#if this.topic.image_url}}
        <a href={{this.topic.lastUnreadUrl}}>
          <div class="topic-image">
            {{#if settings.topic_image_backdrop}}
              <div
                class="topic-image__backdrop"
                style={{this.topicBackgroundStyle}}
              ></div>
            {{/if}}
            <img
              src={{this.topic.image_url}}
              class="topic-image__img"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              alt={{this.topic.fancyTitle}}
            >
          </div>
        </a>
      {{/if}}

      {{discourseTags this.topic mode="list" tagsForUser=this.tagsForUser}}
    </div>

    <FkbTopicMeta @outletArgs={{@outletArgs}} />
  </template>
}
