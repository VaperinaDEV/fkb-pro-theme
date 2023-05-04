import NarrowDesktop from "discourse/lib/narrow-desktop";

export default {
  name: "narrow-view",

  initialize(container) {
    NarrowDesktop.isNarrowDesktopView = (width) => {
      return width < 1000;
    }
  }
}
