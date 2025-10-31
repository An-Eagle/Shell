import Pango from "gi://Pango"
import Gtk from "gi://Gtk?version=4.0"
import { For, createBinding, createComputed } from "ags"
import Bluetooth from "gi://AstalBluetooth"
import { execAsync } from "ags/process"
import Page from "../../../Generics/Page"

const bluetooth = Bluetooth.get_default()

async function BluetoothSettings() {
	try {
		await execAsync(`distrobox-host-exec blueman-manager`)
	} catch (error) {
		console.error(error)
	}
}

async function ConnectBTDevice(dev: Bluetooth.Device) {
	if (dev.paired && !dev.connected) {
		dev.connect_device(null)
	}
	else if (dev.connecting) {
		console.log("connecting")
	}
	else if (dev.connected) {
		dev.disconnect_device(null)
	}
}

function BTDevice (dev: Bluetooth.Device){
	const batteryVisible = createComputed(
	  [createBinding(dev, "batteryPercentage"), createBinding(dev, "connected")],
	  (batt:number, conn:boolean) => conn === true && batt !== null && batt !== -1
	);

	const batteryLabel = createBinding(dev, "batteryPercentage").as((percent: number) =>
	  (percent === null || percent === -1) ? "" : `${percent * 100}%`
	);
	
	return(
	  <button class="pagebutton" onClicked={() => ConnectBTDevice(dev)}>
		<box>
		  <image halign={Gtk.Align.START} iconName={createBinding(dev, "icon")} />
		  <label
			halign={Gtk.Align.START}
			label={createBinding(dev, "alias")}
			ellipsize={Pango.EllipsizeMode.END}
		  />
		  <box hexpand={true} />
		  <label halign={Gtk.Align.END} visible={batteryVisible} label={batteryLabel} />
		  <label
			class="minorbutton"
			halign={Gtk.Align.END}
			visible={createBinding(dev, "connected").as(con => !con)}
			label="Connect"
		  />
		  <image
			halign={Gtk.Align.END}
			visible={batteryVisible}
			iconName={createBinding(dev, "batteryPercentage").as(batt =>
				`battery-level-${Math.floor(batt * 100)}-symbolic`
			)}
		  />
		</box>
	  </button>
	)
}

export default function BluetoothPage({ BluetoothView, setBluetoothView }) {
	return (
		<Page PageView={BluetoothView} setPageView={setBluetoothView} icon={"bluetooth-active-symbolic"} label={"Bluetooth"} finaloption={BluetoothSettings} finaloptionlabel={"Bluetooth Settings"}>
			<box halign={Gtk.Align.CENTER} visible={createBinding(bluetooth, "isPowered").as((p) => (!p))} hexpand>
				<label class="pagetitle" label="Bluetooth Disabled" />
			</box>
			<scrolledwindow>
				<box visible={createBinding(bluetooth, "isPowered")} class="pagebuttonbox" orientation={Gtk.Orientation.VERTICAL} vexpand={true}>
					<For each={createBinding(Bluetooth.get_default(), "devices")}>
						{(dev: Bluetooth.Device) => {
							return (BTDevice(dev))
						}}
					</For>
				</box>
			</scrolledwindow>
		</Page>
	)
}
