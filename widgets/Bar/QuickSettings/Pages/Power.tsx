import { Gtk } from "ags/gtk4"
import { execAsync } from "ags/process"
import Page from "../../../Generics/Page"

async function Logout(getPopoverRef: () => any){
    try {
      const popover = getPopoverRef();
      if (popover) {
        popover.popdown();
      }
      await execAsync(`distrobox-host-exec niri msg action quit`)
    } catch (error) {
      console.error("Logout error :" + error)
    }
}

export default function PowerMenu ({PowerMenuView, setPowerMenuView, getPopoverRef})  {

  return (
    <Page PageView={PowerMenuView} setPageView={setPowerMenuView} icon={"system-shutdown-symbolic"} label={"Power Off"} finaloption={() => Logout(getPopoverRef)} finaloptionlabel="Log out">
      <box class="pagebuttonbox" orientation={Gtk.Orientation.VERTICAL} hexpand={true}>
	<button class="pagebutton"
	  onClicked= { async () => {
	    const popover = getPopoverRef();
            if (popover) {
              popover.popdown();
            }
	    execAsync(`distrobox-host-exec systemctl suspend`)
	  }}
	>
	  <label 
	    halign={Gtk.Align.START}
	    label="Suspend"
	  />
	</button>
	<button class="pagebutton"
	  onClicked= { async () => {
	    const popover = getPopoverRef();
            if (popover) {
              popover.popdown();
            }
	    execAsync(`distrobox-host-exec systemctl reboot`)
	  }}
	>
	  <label 
	    label="Restart..."
	    halign={Gtk.Align.START}
	  />
	</button>
	<button class="pagebutton"
	  onClicked= { async () => {
	    const popover = getPopoverRef();
            if (popover) {
              popover.popdown();
            }
	  execAsync(`distrobox-host-exec systemctl poweroff`)
	  }}
	>
	  <label 
	    label="Poweroff..."
	    halign={Gtk.Align.START}
	  />
	</button>
      </box>
    </Page>
  )
}
