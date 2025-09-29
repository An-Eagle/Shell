import app from "ags/gtk4/app"
import Gtk from "gi://Gtk?version=4.0"
import Gio from "gi://Gio"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { With, Accessor, For, createState, For, createBinding, createComputed } from "ags"
import Tray from "gi://AstalTray"
const tray = Tray.get_default()

export default function SysTray() {
  const items = createBinding(tray, "items")

  const init = (btn: Gtk.MenuButton, item: Tray.TrayItem) => {
    if (item.menuModel instanceof Gio.MenuModel) {
      btn.menuModel = item.menuModel
    } else {
      print("Invalid menuModel, skipping for tray item")
    }

    if (item.actionGroup instanceof Gio.ActionGroup) {
      btn.insert_action_group("dbusmenu", item.actionGroup)
    } else {
      print("Invalid actionGroup, skipping for tray item")
    }

    item.connect("notify::action-group", () => {
      if (item.actionGroup instanceof Gio.ActionGroup) {
	btn.insert_action_group("dbusmenu", item.actionGroup)
      }
    })
  }

  return (
    <box>
      <For each={items}>
        {(item) => (
          <menubutton 
	    $={(self) => {
	      try {
	        init(self, item)
	      } catch (e) {
	        print("Failed to init tray item:", e)
	      }
	    }}
            class="headerbutton" name="Tray Button"
	  >
            <image gicon={createBinding(item, "gicon")} pixelSize={20} />
          </menubutton>
        )}
      </For>
    </box>
  )
}
