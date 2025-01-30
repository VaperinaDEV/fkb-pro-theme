export default function migrate(settings) {
  if (settings.has("fkb_panel_items")) {
    let oldItems = settings.get("fkb_panel_items");

    if (typeof oldItems === 'string') {
      try {
        oldItems = JSON.parse(oldItems);
      } catch (e) {
        console.error("Failed to parse fkb_panel_items", e);
        return settings;
      }
    }

    if (!Array.isArray(oldItems)) {
      console.error("fkb_panel_items is not an array");
      return settings;
    }

    const newItems = oldItems.map(item => ({
      title: item.title,
      link: item.link,
      icon: item.icon
    }));
    settings.set("fkb_panel_items", newItems);
  }
  return settings;
}
