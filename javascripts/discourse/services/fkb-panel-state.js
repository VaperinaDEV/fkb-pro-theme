import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

const STORAGE_KEY = "fkb_panel_hidden";
const PANEL_BREAKPOINT = "(max-width: 1099px)";

export default class FkbPanelStateService extends Service {
  @tracked hidden = false;

  _responsiveHidden = false;
  _mediaQuery = null;

  constructor() {
    super(...arguments);

    this.hidden = this._read();
    this._setupResponsiveState();
    this._apply();
  }

  get expanded() {
    return !this.hidden;
  }

  toggle() {
    // A user action always takes precedence over the temporary responsive state.
    this._responsiveHidden = false;
    this.setHidden(!this.hidden);
  }

  show() {
    this._responsiveHidden = false;
    this.setHidden(false);
  }

  hide() {
    this._responsiveHidden = false;
    this.setHidden(true);
  }

  setHidden(hidden) {
    this.hidden = Boolean(hidden);
    this._persist();
    this._apply();
  }

  _setupResponsiveState() {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    this._mediaQuery = window.matchMedia(PANEL_BREAKPOINT);
    this._handleBreakpointChange = (event) => {
      if (event.matches) {
        // Only auto-hide a panel which was actually open. A manually hidden
        // panel must remain hidden when the viewport becomes narrow.
        if (!this.hidden) {
          this._responsiveHidden = true;
          this.hidden = true;
          this._apply();
        }
      } else if (this._responsiveHidden) {
        // CSS allows the panel again, so restore the state that existed before
        // the responsive breakpoint temporarily hid it.
        this._responsiveHidden = false;
        this.hidden = false;
        this._apply();
      }
    };

    if (this._mediaQuery.matches && !this.hidden) {
      this._responsiveHidden = true;
      this.hidden = true;
    }

    if (this._mediaQuery.addEventListener) {
      this._mediaQuery.addEventListener("change", this._handleBreakpointChange);
    } else {
      this._mediaQuery.addListener(this._handleBreakpointChange);
    }
  }

  _persist() {
    // Responsive auto-hide is temporary and must not overwrite the user's
    // preference. Manual changes continue to be persisted normally.
    if (this._responsiveHidden) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, String(this.hidden));
    } catch {
      // Keep the in-memory state if localStorage is unavailable.
    }
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

  willDestroy() {
    if (this._mediaQuery && this._handleBreakpointChange) {
      if (this._mediaQuery.removeEventListener) {
        this._mediaQuery.removeEventListener(
          "change",
          this._handleBreakpointChange
        );
      } else {
        this._mediaQuery.removeListener(this._handleBreakpointChange);
      }
    }

    super.willDestroy(...arguments);
  }
}
