import Pango from "gi://Pango"
import { For, createBinding, createComputed } from "ags"
import { Gtk } from "ags/gtk4"
import Bluetooth from "gi://AstalBluetooth"
import { execAsync } from "ags/process"
import Page from "../../../Generics/Page"

const bluetooth = Bluetooth.get_default()

async function BluetoothSettings () {
    try {
      await execAsync(`distrobox-host-exec blueman-manager`)
    } catch (error) {
      console.error(error)
    }   
}

export default function BluetoothPage({BluetoothView, setBluetoothView}) {
    return (
      <Page PageView={BluetoothView} setPageView={setBluetoothView} icon={"bluetooth-active-symbolic"} label={"Bluetooth"} finaloption={BluetoothSettings} finaloptionlabel={"Bluetooth Settings"}>
	<box visible ={createBinding(bluetooth, "isPowered").as((p)=> (!p))}>
	  <label label="Bluetooth Disabled" />
	</box>
	<scrolledwindow>
	  <box visible={createBinding(bluetooth, "isPowered")} class="pagebuttonbox" orientation = {Gtk.Orientation.VERTICAL} vexpand={true}>
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
			 visible={createComputed([createBinding(dev, "batteryPercentage"),createBinding(dev,"connected")], (batt, conn) => 
			   conn === true && batt !== null && batt !== "" && batt !== -1 
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
			 visible={createComputed([createBinding(dev, "batteryPercentage"),createBinding(dev,"connected")], (batt, conn) => 
			   conn === true && batt !== null && batt !== "" && batt !== -1 
			 )}
			 iconName={createBinding(dev, "batteryPercentage").as(batt =>
			`battery-level-${Math.floor(batt * 100)}-symbolic`)}
		       />
		     </box>
		   </button>
		 )}}
	    </For>
	  </box>
	</scrolledwindow>
      </Page>
  )
}
