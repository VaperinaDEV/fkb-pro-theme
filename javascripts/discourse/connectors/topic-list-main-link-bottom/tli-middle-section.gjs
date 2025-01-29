import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";
import replaceEmoji from "discourse/helpers/replace-emoji";
import i18n from "discourse-common/helpers/i18n";

export default class TliMiddleSection extends Component {
  
  get topic() {
    return this.args.outletArgs.topic;
  }

  <template>
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
              <div class="topic-image__backdrop" style="background-image: url({{this.topic.image_url}});" loading="lazy"></div>
            {{/if}}
            <img src="{{this.topic.image_url}}" class="topic-image__img" loading="lazy">
          </div>
        </a>
      {{/if}}
    </div>
  </template>
}
