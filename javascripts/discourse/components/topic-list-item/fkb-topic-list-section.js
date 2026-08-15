import Component from "@glimmer/component";

export default class FkbTopicListSection extends Component {
  get topic() {
    return this.args.outletArgs.topic;
  }

  get tagsForUser() {
    return this.args.outletArgs.tagsForUser;
  }
}
