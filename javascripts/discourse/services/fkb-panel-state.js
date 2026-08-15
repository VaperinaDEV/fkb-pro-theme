import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";

const STORAGE_KEY = "fkb_panel_hidden";

export default class FkbPanelStateService extends Service {
  @tracked hidden = false;

  constructor() {
    super(...arguments);
    this.hidden = this._read();
    this._apply();
  }

  get expanded() {
    return !this.hidden;
  }

  toggle() {
    this.setHidden(!this.hidden);
  }

  show() {
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
