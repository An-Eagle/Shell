import app from "ags/gtk4/app"
import { Gtk } from "ags/gtk4"
import { createState, createBinding } from "ags"

import { QuickToggleTitle, QuickToggleSubtitle, QuickToggleHasMenuTitle, QuickToggleHasMenuSubtitle } from "../../../Defaults/Style" 

import Network from "gi://AstalNetwork"
const network = Network.get_default()

import Bluetooth from "gi://AstalBluetooth"
const bluetooth = Bluetooth.get_default()

import PowerProfiles from "gi://AstalPowerProfiles"
const powerprofiles = PowerProfiles.get_default()



export default function QuickToggles({setWifiView,setBluetoothView }) {
  let caffeineCookie = null
  const [Caffeine, setCaffeine] = createState("my-caffeine-off-symbolic")
  return (
    <box orientation={Gtk.Orientation.VERTICAL}>
	      <box orientation={Gtk.Orientation.HORIZONTAL}>
		<box>
		  <togglebutton
		    name = "quicktogglehasmenu" class = "quicktogglehasmenu" 
		    active={createBinding(network.wifi, "state").as(state => ![0, 10, 20].includes(state))} 
		    onToggled={({active}) => {
		      network.wifi.set_enabled(active)
		    }}
		  >
		    <box orientation={Gtk.Orientation.HORIZONTAL}>
		      <image class="quicktoggleicon" iconName="network-wireless-signal-excellent-symbolic" pixelSize={28}/>
		      <box 
			valign={Gtk.Align.CENTER}
			halign
			orientation={Gtk.Orientation.VERTICAL}
		      >
			<QuickToggleHasMenuTitle label = "Wifi"/>
			<QuickToggleHasMenuSubtitle
			  label = {createBinding(network.wifi, "ssid").as(ssid => ssid ?? "")} 
			  visible= {createBinding(network.wifi, "activeConnection")} 
			/>
		      </box>
		    </box>
		  </togglebutton>
		  <button name ="quicktogglemenu" class = "quicktogglemenu" onClicked={(btn)=> {
                    setWifiView(true) 
                  }}>
	            <image iconName="go-next-symbolic"/>
		  </button>
		</box>
		  <box>
		    <togglebutton
		      name = "quicktogglehasmenu" class = "quicktogglehasmenu"
		      active={createBinding(bluetooth, "isPowered").as(powered => powered ?? false)}
		      onToggled={({ active }) => {bluetooth.adapter?.set_powered(!bluetooth.adapter.powered)}}
		    >
		      <box orientation={Gtk.Orientation.HORIZONTAL}>
			<image class="quicktoggleicon" iconName="bluetooth-active-symbolic" pixelSize={28}/>
			<box 
			  valign={Gtk.Align.CENTER}
			  halign
			  orientation={Gtk.Orientation.VERTICAL}
			>
			  <QuickToggleHasMenuTitle label = "Bluetooth"/>
			  <QuickToggleHasMenuSubtitle
			    label ="Connected Device ?"
			    visible= {createBinding(bluetooth, "isConnected")} 
			  />
			</box>
		      </box>
		    </togglebutton>
		    <button name="quicktogglemenu" class="quicktogglemenu" onClicked={()=> {
                      setBluetoothView(true) 
                    }}>
	              <image iconName="go-next-symbolic"/>
		    </button>
		  </box>
	      </box>
	      <box orientation={Gtk.Orientation.HORIZONTAL}>
		<box> 
		  <togglebutton
		    hexpand={false}
		    name = "quicktoggle" class = "quicktoggle"
		    active={createBinding(powerprofiles, "activeProfile").as(profile => profile === "power-saver")}
		    onToggled={({ active }) => {
		      const newProfile = active ? "power-saver" : "balanced";
		      if (powerprofiles.activeProfile !== newProfile) {
			powerprofiles.set_active_profile(newProfile);
		      }
		    }}

		  >
		    <box hexpand = {false }orientation={Gtk.Orientation.HORIZONTAL}>
		      <image class="quicktoggleicon" iconName="power-profile-performance-symbolic" pixelSize={24}/>
		      <box
			valign={Gtk.Align.CENTER}
			halign
			orientation={Gtk.Orientation.VERTICAL}
		      >
			<QuickToggleTitle 
			  label="Power Mode"
			  class="quicktoggletitle"
			/>
			<QuickToggleSubtitle
			  label = {createBinding(powerprofiles, "activeProfile").as(prof => prof ?? "")}
			  class="quicktogglesubtitle"
			/>
		      </box>
		    </box>
		  </togglebutton>
		  <togglebutton
		    name = "quicktoggle" class = "quicktoggle"
		    onToggled = {({ active }) => {
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
		    }}
		  >
		    <box orientation={Gtk.Orientation.HORIZONTAL}>
		      <image class="quicktoggleicon" iconName={Caffeine} pixelSize={24}/>
		      <box
			valign={Gtk.Align.CENTER}
			halign
			orientation={Gtk.Orientation.VERTICAL}
		      >
			<QuickToggleTitle label="Caffeine"
			  class="quicktoggletitle"
			/>
		      </box>
		    </box>
		  </togglebutton>
		</box>
	      </box>
	    </box>

  )
}
