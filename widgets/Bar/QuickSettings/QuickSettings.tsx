import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { With, createState, onCleanup } from "ags"
import GObject, { register, property } from "ags/gobject"

import Sliders from "./Elements/Sliders"
import QuickToggles from "./Elements/QuickToggles"
import TopButton from "./Elements/Topbutton"
import Notifications from "./Elements/Notifications"

import PowerPage from "./Pages/Power"
import WifiPage from "./Pages/Wifi"
import BluetoothPage from "./Pages/Bluetooth"
import GenericPage from "../../Generics/Page"
export default function QuickSettings() {
  const [OverlayView, setOverlayView] = createState(false)
  const [PowerMenuView, setPowerMenuView] = createState(false)
  const [WifiView, setWifiView] = createState(false)
  const [BluetoothView, setBluetoothView] = createState(false)
  let popoverRef: Gtk.Popover;
  onCleanup(() => {
    setPowerMenuView(false)
    setWifiView(false)
    setBluetoothView(false)
  })
  return (
    <popover 
      $={(p) => (popoverRef = p)} 
      onHide={(self) => {
        setPowerMenuView(false)
        setWifiView(false)
        setBluetoothView(false)
      }} 
      name="quicksettings" 
      class="quicksettings"
    >
      <overlay>
        <box orientation={Gtk.Orientation.VERTICAL} >
	  <TopButton getPopoverRef={() => popoverRef} PowerMenuView={PowerMenuView} setPowerMenuView={setPowerMenuView} />
  	  <Sliders/>
	  <QuickToggles WifiView={WifiView} setWifiView={setWifiView} BluetoothView={BluetoothView} setBluetoothView={setBluetoothView} />
	  <Notifications OverlayView={OverlayView} setOverlayView={setOverlayView} />
      	</box>
	<box $type="overlay" visible = {PowerMenuView}>
	  <PowerPage PowerMenuView={PowerMenuView} setPowerMenuView={setPowerMenuView}/>
	</box>
	<box $type="overlay" visible = {WifiView}>
	  <WifiPage WifiView={WifiView} setWifiView={setWifiView}/>
	</box>
	<box $type="overlay" visible = {BluetoothView}>
	  <BluetoothPage BluetoothView={BluetoothView} setBluetoothView={setBluetoothView}/>
	</box>
	<box $type="overlay" visible ={false}>
	  <GenericPage>
	    <label/>
	  </GenericPage>
	</box>
      </overlay>
    </popover>
  )
}
