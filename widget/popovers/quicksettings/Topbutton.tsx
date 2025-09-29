import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"

import { PageTitle } from "../../defaults/Style"

export default function TopButton ({ getPopoverRef, OverlayView, setOverlayView }) {
  return (
   <box class="topbox" orientation={Gtk.Orientation.HORIZONTAL}>
      <button 
	class = "topbutton"
	onClicked= { () => {
          const popover = getPopoverRef();
          if (popover) {
            popover.popdown();
          }
	  execAsync(`distrobox-host-exec niri msg action screenshot`)
	}}
      >
	<image class="topicon" iconName="screenshooter-symbolic"/>
      </button>
      <box hexpand={true}/>
      <button
	halign={Gtk.Align.END}
	class = "topbutton"
	onClicked= { async () => 
	  execAsync(`distrobox-host-exec hyprlock`)
	}
      >
	<image class="topicon" iconName="changes-prevent-symbolic" pixelSize={16} />
      </button>
      <menubutton class="topmenu" halign={Gtk.Align.END} onNotifyActive={(btn)=> {
        setOverlayView(btn.active) 
      }}>
	<image class="topicon" iconName="system-shutdown-symbolic" pixelSize={24}/>
	<popover  class="toppage">
	  <box orientation={Gtk.Orientation.VERTICAL}>
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
	</popover>
      </menubutton>
    </box>
  )
}
