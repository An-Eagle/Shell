import GLib from "gi://GLib"
import app from "ags/gtk4/app"
import { onCleanup } from "ags"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createPoll } from "ags/time"

import SystemStatus from "./QuickSettings/SystemStatus"
import QuickSettings from "./QuickSettings/QuickSettings"
import Tray from "./Tray/Tray"

export default function Bar({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) { 
  let win: Astal.Window
  const time = createPoll("", 1000, () => {
    return GLib.DateTime.new_now_local().format("%b %-e   %H:%M")!
  })
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  onCleanup(() => {
    // Root components (windows) are not automatically destroyed.
    // When the monitor is disconnected from the system, this callback
    // is run from the parent <For> which allows us to destroy the window
    win.destroy()
  })
  return (
    <window
      $={(self) => (win = self)}
      namespace="my-bar"
      name={`bar-${gdkmonitor.connector}`}
      class="Bar"
      visible
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="centerbox">
        <box
          $type="start"
          hexpand
          halign={Gtk.Align.CENTER}
        >
        </box>
        <menubutton 
	  name="headerbutton" class = "headerbutton"
	  $type="center" 
	  hexpand 
	  halign={Gtk.Align.CENTER}
	>
          <label label={time} />
          <popover class="calendarpopover" >
	    <box>
              <Gtk.Calendar show-heading={false} class="calendar" />
	    </box>
          </popover>
        </menubutton>
	<box
          $type="end"
	>
	  <Tray/>
	  <menubutton 
            name="headerbutton" class = "headerbutton">
              <SystemStatus/>
              <QuickSettings/>
          </menubutton>
	</box>
      </centerbox>
    </window>
  )
}
