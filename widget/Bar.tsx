import GLib from "gi://GLib"
import app from "ags/gtk4/app"
import { For, createBinding } from "ags"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"

import SystemStatus from "./SystemStatus.tsx"
import QuickSettings from "./popovers/QuickSettings.tsx"
import Tray from "./popovers/Tray.tsx"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const time = createPoll("", 1000, () => {
    return GLib.DateTime.new_now_local().format("%b %-e %H:%M")!
  })
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      name="bar"
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
          <popover class="calendarpopover">
            <Gtk.Calendar show-heading={false} class="calendar" />
          </popover>
        </menubutton>
	<box
          $type="end"
	>
	  <Tray/>
	  <menubutton 
            name="headerbutton" class = "headerbutton">
              <SystemStatus/>
              <popover name="quicksettings" class="quicksettings">
                <QuickSettings/>
              </popover>
          </menubutton>
	</box>
      </centerbox>
    </window>
  )
}
