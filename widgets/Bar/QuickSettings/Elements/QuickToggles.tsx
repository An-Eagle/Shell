import app from "ags/gtk4/app"
import Gtk from "gi://Gtk?version=4.0"
import { createState, createBinding } from "ags"

import { QuickToggleTitle, QuickToggleSubtitle, QuickToggleHasMenuTitle, QuickToggleHasMenuSubtitle } from "../../../Defaults/Style"
import { QuickToggleProps } from "../../../Generics/Interfaces"

import Network from "gi://AstalNetwork"
const network = Network.get_default()

import Bluetooth from "gi://AstalBluetooth"
const bluetooth = Bluetooth.get_default()

import PowerProfiles from "gi://AstalPowerProfiles"
const powerprofiles = PowerProfiles.get_default()


function ToggleBT(active: boolean) {
	() => { bluetooth.adapter.set_powered(!bluetooth.adapter.powered) }
}

function ToggleWifi(active: boolean) {
	network.wifi.set_enabled(active)
}

function TogglePower(active: boolean) {
	const newProfile = active ? "power-saver" : "balanced";
	if (powerprofiles.activeProfile !== newProfile) {
		powerprofiles.set_active_profile(newProfile);
	}
}


function QuickToggleHasMenu({ setMenu, icon, label, togglecmd, subtitle, subvis, toggleactive }: QuickToggleProps) {
	return (
		<box>
			<togglebutton
				name="quicktogglehasmenu" class="quicktogglehasmenu"
				active={toggleactive}
				onToggled={({ active }) => {
					togglecmd(active)
				}}
			>
				<box orientation={Gtk.Orientation.HORIZONTAL}>
					<image class="quicktoggleicon" iconName={icon} pixelSize={28} />
					<box
						valign={Gtk.Align.CENTER}
						halign
						orientation={Gtk.Orientation.VERTICAL}
					>
						<QuickToggleHasMenuTitle label={label} />
						<QuickToggleHasMenuSubtitle
							label={subtitle}
							visible={subvis}
						/>
					</box>
				</box>
			</togglebutton>
			<button name="quicktogglemenu" class="quicktogglemenu" onClicked={(btn) => {
				setMenu(true)
			}}>
				<image iconName="go-next-symbolic" />
			</button>
		</box>
	)
}

function QuickToggle({ icon, label, togglecmd, subtitle, toggleactive }: QuickToggleProps) {
	return (
		<togglebutton
			hexpand={false}
			name="quicktoggle" class="quicktoggle"
			active={toggleactive}
			onToggled={({ active }) => {
				togglecmd(active)
			}}
		>
			<box hexpand={false} orientation={Gtk.Orientation.HORIZONTAL}>
				<image class="quicktoggleicon" iconName={icon} pixelSize={24} />
				<box
					valign={Gtk.Align.CENTER}
					halign
					orientation={Gtk.Orientation.VERTICAL}
				>
					<QuickToggleTitle
						label={label}
						class="quicktoggletitle"
					/>
					<QuickToggleSubtitle
						label={subtitle}
						class="quicktogglesubtitle"
					/>
				</box>
			</box>
		</togglebutton>
	)
}

export default function QuickToggles({ setWifiView, setBluetoothView }) {
	const wifiactive = createBinding(network.wifi, "state").as(state => ![0, 10, 20].includes(state))
	const wifisubtitle = createBinding(network.wifi, "ssid").as((ssid: String) => ssid ?? "")
	const wifisubtitlevis = createBinding(network.wifi, "activeConnection")

	const btactive = createBinding(bluetooth, "isPowered").as((powered: boolean) => powered ?? false)
	const btsubtitle = "Connected Device ?"
	const btsubtitlevis = createBinding(bluetooth, "isConnected")

	const poweractive = createBinding(powerprofiles, "activeProfile").as((profile: String) => profile === "power-saver")
	const powersubtitle = createBinding(powerprofiles, "activeProfile").as(prof => prof ?? "")

	const [Caffeine, setCaffeine] = createState("my-caffeine-off-symbolic")

	function ToggleCaffeine(active: boolean) {
		let caffeineCookie = null
		if (active) {
			caffeineCookie = app.inhibit(
				null,
				Gtk.ApplicationInhibitFlags.IDLE,
				"Caffeine mode enabled"
			)
			setCaffeine("my-caffeine-on-symbolic")
		} else if (caffeineCookie !== null) {
			app.uninhibit(caffeineCookie);
			caffeineCookie = null;
			setCaffeine("my-caffeine-off-symbolic")
		}
	}

	return (
		<box orientation={Gtk.Orientation.VERTICAL}>
			<box orientation={Gtk.Orientation.HORIZONTAL}>
				<QuickToggleHasMenu setMenu={setWifiView} icon={"network-wireless-signal-excellent-symbolic"} label={"Wi-Fi"} togglecmd={ToggleWifi} subtitle={wifisubtitle} subvis={wifisubtitlevis} toggleactive={wifiactive} />
				<QuickToggleHasMenu setMenu={setBluetoothView} icon={"bluetooth-active-symbolic"} label={"Bluetooth"} togglecmd={ToggleBT} subtitle={btsubtitle} subvis={btsubtitlevis} toggleactive={btactive} />
			</box>
			<box orientation={Gtk.Orientation.HORIZONTAL}>
				<QuickToggle icon={"power-profile-performance-symbolic"} label={"Power Mode"} togglecmd={TogglePower} subtitle={powersubtitle} toggleactive={poweractive} />
				<QuickToggle icon={Caffeine} label={"Caffeine"} togglecmd={ToggleCaffeine} />
			</box>
		</box>

	)
}
