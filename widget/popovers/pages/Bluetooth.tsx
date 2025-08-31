import Pango from "gi://Pango"
import app from "ags/gtk4/app"
import { With, Accessor, For, createState, For, createBinding } from "ags"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import Bluetooth from "gi://AstalBluetooth"
import { execAsync } from "ags/process"
import { PageTitle } from "../../defaults/Style"
const bluetooth = Bluetooth.get_default()

async function BluetoothSettings () {
    try {
      await execAsync(`distrobox-host-exec blueman-manager`)
    } catch (error) {
      console.error(error)
    }   
}

export default function BluetoothPage() {
    return (
    <popover class="bluetoothpage" name="Bluetooth page">
      <box orientation = {Gtk.Orientation.VERTICAL}>
        <box orientation = {Gtk.Orientation.HORIZONTAL}>
	  <image class="pageicon" iconName="bluetooth-active-symbolic" pixelSize={32}/>
	  <PageTitle label="Bluetooth"/>
	</box>
        <box class="pagebuttonbox" orientation = {Gtk.Orientation.VERTICAL}>
	  <For each={createBinding(Bluetooth.get_default(), "devices")}>
	     {(dev: Bluetooth.Device) => {
	       return (
		 <button 
		   class = "pagebutton"
		   onClicked={() => {
		     if (dev.paired && !dev.connected) {
		       dev.connect_device(null)
		     }
		     else if (dev.connecting) {
		       return
		     }
		     else if (dev.connected) {
		       dev.disconnect_device(null)
		     }
		 }}>
		   <box>
		     <image 
		       halign={Gtk.Align.START}
		       iconName={createBinding(dev, "icon")} />
		     <label 
		       halign={Gtk.Align.START}
		       label={createBinding(dev, "alias")} 
		       ellipsize={Pango.EllipsizeMode.END} 
		     />
		     <box hexpand={true} />
		     <label 
		       halign={Gtk.Align.END}
                       visible={createBinding(dev, "batteryPercentage").as(batt =>
                         batt !== null && batt !== "" && batt !== -1
		       )}

		       label={createBinding(dev, "batteryPercentage").as(percent => 
		         (percent === null || percent === "" || percent === -1)
			   ? "" 
			   : `${percent*100}%`
		       )}
		     />
		     <label
		       class="minorbutton"
		       halign={Gtk.Align.END}
		       visible={createBinding(dev, "connected").as(con => !con)}
		       label="Connect"
		     />
		     <image
		       halign={Gtk.Align.END}
		       visible={createBinding(dev, "batteryPercentage").as(batt =>
                         batt !== null && batt !== "" && batt !== -1
		       )}
		       iconName={createBinding(dev, "batteryPercentage").as(batt =>
		      `battery-level-${Math.floor(batt * 100)}-symbolic`)}
		     />
		   </box>
		 </button>
	       )}}
	  </For>
	</box>
	<Gtk.Separator class="pageseparator" orientation={Gtk.Orientation.HORIZONTAL}/>
	<box class="settingsbuttonbox">
	  <button
	    class="pagebutton"
	    hexpand={true}
	    onClicked = {() => <BluetoothSettings/>}
	  >
	    <label
	      halign={Gtk.Align.START}
	      label="Bluetooth settings"
	    />
	  </button>
	</box>
      </box>
    </popover>
  )
}
