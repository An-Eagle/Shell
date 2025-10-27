import { Gtk } from "ags/gtk4"
import { execAsync } from "ags/process"

export default function TopButton ({ getPopoverRef, setPowerMenuView }) {

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
	onClicked= { () => {
	  const popover = getPopoverRef();
          if (popover) {
            popover.popdown();
          }
	  execAsync(`distrobox-host-exec hyprlock`)
	}}
      >
	<image class="topicon" iconName="changes-prevent-symbolic" pixelSize={16} />
      </button>
      <button class="topbutton" halign={Gtk.Align.END} onClicked={()=> {
        setPowerMenuView(true) 
      }}>
	<image class="topicon" iconName="system-shutdown-symbolic" pixelSize={24}/>
      </button>
    </box>
  )
}
