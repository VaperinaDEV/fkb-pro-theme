import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import { getURLWithCDN } from "discourse-common/lib/get-url";

export default {
  setupComponent(attrs, component) {

    if (!this.site.mobileView) {
      withPluginApi("0.8.7", (api) => {
        // script wont run unless user is logged in
        if (api.getCurrentUser() === null) return false;

        let username = component.get("currentUser.username");
        
        ajax("/u/" + username + "/summary.json").then (function(result) {
          const userLikesReceived = result.user_summary.likes_received;
          const userLikesGiven = result.user_summary.likes_given;        
          const userDayVisited = result.user_summary.days_visited;
          const userTopicCount = result.user_summary.topic_count;
          const userPostCount = result.user_summary.post_count;
          const userTimeRead = result.user_summary.time_read;
          const userBookmarkCount = result.user_summary.bookmark_count;
          const userSolvedCount = result.user_summary.solved_count;

          component.set("userLikesReceived", userLikesReceived);
          component.set("userLikesGiven", userLikesGiven);
          component.set("userDayVisited", userDayVisited);
          component.set("userTopicCount", userTopicCount);
          component.set("userPostCount", userPostCount);
          component.set("userTimeRead", userTimeRead);
          component.set("userBookmarkCount", userBookmarkCount);
          component.set("userSolvedCount", userSolvedCount);

          component.set("userName", api.getCurrentUser().name);
          component.set("user", api.getCurrentUser().username);         
        });

        ajax("/u/" + username + "/card.json").then (function(result) {
          const userCardBg = result.user.card_background_upload_url;
          const stinkinBadges = [];
          const allBadges = result.user.badge_count;

          if (result.badges) {
            result.badges.forEach(function(badges){
              stinkinBadges.push(badges);
            });
          }

          component.set("userCardBg", `${getURLWithCDN(userCardBg)}`);
          component.set("stinkinBadges", stinkinBadges);
          component.set("allBadges", allBadges);
        });
      });
    }
  },
};
