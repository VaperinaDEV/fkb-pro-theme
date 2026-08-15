import Component from "@glimmer/component";
import UserStat from "discourse/components/user-stat";

export default class FkbPanelStats extends Component {
  <template>
    <div class="stats">
      {{#if @userDetails}}
        <UserStat
          @value={{@userDetails.user_summary.likes_received}}
          @icon="heart"
          @label="user.summary.likes_received"
        />
        <a href="/u/{{@user.username}}/activity/likes-given">
          <UserStat
            @value={{@userDetails.user_summary.likes_given}}
            @icon="heart"
            @label="user.summary.likes_given"
          />
        </a>
        {{#if settings.fkb_panel_show_solutions}}
          <a href="/u/{{@user.username}}/activity/solved">
            <UserStat
              @value={{@userDetails.user_summary.solved_count}}
              @icon="square-check"
              @label="solved.solution_summary.other"
            />
          </a>
        {{/if}}
        <a href="/u/{{@user.username}}/activity/topics">
          <UserStat
            @value={{@userDetails.user_summary.topic_count}}
            @label="user.summary.topic_count"
          />
        </a>
        <a href="/u/{{@user.username}}/activity/replies">
          <UserStat
            @value={{@userDetails.user_summary.post_count}}
            @label="user.summary.post_count"
          />
        </a>
      {{/if}}
    </div>
  </template>
}
