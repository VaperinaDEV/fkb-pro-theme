import { withSilencedDeprecations } from "discourse/lib/deprecated";
import { withPluginApi } from "discourse/lib/plugin-api";

function avatarSize(api) {
  // Change avatar size on desktop
  api.registerValueTransformer(
    "post-avatar-size",
    () => 60
  );
  
  // wrap the old widget code silencing the deprecation warnings
  withSilencedDeprecations("discourse.post-stream-widget-overrides", () =>
    oldAvatarSize(api)
  );
}

// old widget code
function oldAvatarSize(api) {
  // Change avatar size on desktop
  api.changeWidgetSetting("post-avatar", "size", 60);
}

export default {
  name: "avatar-size",
  initialize(container) {
    const site = api.container.lookup("site:main");

    if (!site.mobileView) {
      withPluginApi((api) => {
        avatarSize(api);
      });
    }
  },
};
