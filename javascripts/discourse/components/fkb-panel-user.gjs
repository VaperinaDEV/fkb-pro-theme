import Component from "@glimmer/component";
import avatar from "discourse/helpers/avatar";

export default class FkbPanelUser extends Component {
  <template>
    <div class="fkb-avatar">
      <a href="/u/{{@user.username}}">
        {{avatar @user imageSize="medium"}}
      </a>
      <a href="/u/{{@user.username}}" class="fkb-user-names">
        <span class="fkb-name">{{@user.name}}</span>
        <span class="fkb-username">{{@user.username}}</span>
      </a>
    </div>
  </template>
}
