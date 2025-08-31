import Pango from "gi://Pango"
import app from "ags/gtk4/app"
import { With, Accessor, For, createState, For, createBinding } from "ags"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { PageTitle } from "../../defaults/Style"

export default function PowerMenu () {
  return (
    <box class ="overlaypage" orientation={Gtk.Orientation.VERTICAL}>
      <box orientation={Gtk.Orientation.HORIZONTAL}>
	<image class="pageicon" iconName="system-shutdown-symbolic" pixelSize={24}/>
	<PageTitle class="pagetitle" label="Power Off"/>
      </box>
      <box class="pagebuttonbox" orientation={Gtk.Orientation.VERTICAL}>
	<button class="pagebutton"
	  onClicked= { async () => 
	  execAsync(`distrobox-host-exec systemctl suspend`)
	  }
	>
	  <label 
	    halign={Gtk.Align.START}
	    label="Suspend"
	  />
	</button>
	<button class="pagebutton"
	  onClicked= { async () => 
	  execAsync(`distrobox-host-exec systemctl reboot`)
	  }
	>
	  <label 
	    label="Restart..."
	    halign={Gtk.Align.START}
	  />
	</button>
	<button class="pagebutton"
	  onClicked= { async () => 
	  execAsync(`distrobox-host-exec systemctl poweroff`)
	  }
	>
	  <label 
	    label="Poweroff..."
	    halign={Gtk.Align.START}
	  />
	</button>
      </box>
      <Gtk.Separator class="pageseparator" orientation={Gtk.Orientation.HORIZONTAL}/>
      <box class="settingsbuttonbox">
	<button class="pagebutton"
	  onClicked= { async () => 
	  execAsync(`distrobox-host-exec niri msg action quit`)
	  }
	>
	  <label 
	    halign={Gtk.Align.START}
	    hexpand={true}
	    label="Log Out..."
	  />
	</button>
      </box>
    </box>
  )
}
