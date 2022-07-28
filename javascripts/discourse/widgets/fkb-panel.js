import { createWidget } from "discourse/widgets/widget";
import {
  avatarImg,
  getRawSize,
} from "discourse/lib/utilities";
import getURL, { getURLWithCDN } from "discourse-common/lib/get-url";
import { userPath } from "discourse/lib/url";
import User from "discourse/models/user";
import DiscourseURL from "discourse/lib/url";
import { h } from "virtual-dom";

function getUser() {
  var user = User.current();
  return user;
}

createWidget('fkb-avatar', {
  tagName: '',

  userAvatarUrl() {
    let rawSize = getRawSize;
    return this.user.get('avatar_template').replace("{size}", rawSize(45));
  },

  html() {
    this.user = getUser();
    return [
      this.userAvatar(),
      this.userNames(),
    ];
  },

  linkToUser() {
    return {
      href: `/u/${this.user.get('username')}/summary`,
    };
  },

  userAvatar() {
    return h('a', this.linkToUser(), [
      h('img.avatar', {
        loading: "lazy",
        width: 45,
        height: 45,
        src: getURLWithCDN(this.userAvatarUrl())
      })
    ]);
  },
  
  userNames() {
    return h('a.fkb-user-names', this.linkToUser(), [
      h('span.fkb-name', this.user.get('name')),
      h('span.fkb-username', this.user.get('username'))
    ])
  }
});
