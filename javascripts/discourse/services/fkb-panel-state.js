import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { registerDestructor } from "@ember/destroyable";

const STORAGE_KEY = "fkb_panel_hidden";
const PANEL_BREAKPOINT = 1099;

export default class FkbPanelStateService extends Service {
  @tracked hidden = false;

  constructor() {
    super(...arguments);
    this.hidden = this._read();

    this._mediaQuery = window.matchMedia(
      `(max-width: ${PANEL_BREAKPOINT}px)`
    );
    this._mediaQuery.addEventListener("change", this._handleMediaQueryChange);

    // The panel is hidden by CSS on tablet-sized screens, so keep the actual
    // state in sync as well. This removes its grid column instead of leaving
    // an empty slot behind.
    if (this._mediaQuery.matches) {
      this.setHidden(true);
    } else {
      this._apply();
    }

    registerDestructor(this, () => {
      this._mediaQuery?.removeEventListener(
        "change",
        this._handleMediaQueryChange
      );
    });
  }

  _handleMediaQueryChange = (event) => {
    if (event.matches) {
      this.hide();
    }
  };

  get expanded() {
    return !this.hidden;
  }

  toggle() {
    if (this._mediaQuery?.matches) {
      return;
    }

    this.setHidden(!this.hidden);
  }

  show() {
    if (this._mediaQuery?.matches) {
      return;
    }

    this.setHidden(false);
  }

  hide() {
    this.setHidden(true);
  }

  setHidden(hidden) {
    this.hidden = Boolean(hidden);

    try {
      localStorage.setItem(STORAGE_KEY, String(this.hidden));
    } catch {
      // Keep the in-memory state if localStorage is unavailable.
    }

    this._apply();
  }

  _read() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  }

  _apply() {
    document.body.classList.toggle("fkb-panel-hidden", this.hidden);
  }
}
