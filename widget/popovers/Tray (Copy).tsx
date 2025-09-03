import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { With, Accessor, For, createState, For, createBinding, createComputed } from "ags"
import Tray from "gi://AstalTray"
const tray = Tray.get_default()

export default function SysTray() {
  const items = createBinding(tray, "items")

  const init = (btn: Gtk.MenuButton, item: Tray.TrayItem) => {
    btn.menuModel = item.menuModel
    btn.insert_action_group("dbusmenu", item.actionGroup)
    item.connect("notify::action-group", () => {
      btn.insert_action_group("dbusmenu", item.actionGroup)
    })
  }

  return (
    <box>
      <For each={items}>
        {(item) => (
          <menubutton 
	    $={(self) => init(self, item)}
            class="headerbutton" name="Tray Button"
	  >
            <image gicon={createBinding(item, "gicon")} />
          </menubutton>
        )}
      </For>
    </box>
  )
}
