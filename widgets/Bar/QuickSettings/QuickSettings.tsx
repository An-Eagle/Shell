import { Gtk } from "ags/gtk4"
import { createState } from "ags"

import Sliders from "./Elements/Sliders"
import QuickToggles from "./Elements/QuickToggles"
import TopButton from "./Elements/Topbutton"
import Notifications from "./Elements/Notifications"

import PowerPage from "./Pages/Power"
import WifiPage from "./Pages/Wifi"
import BluetoothPage from "./Pages/Bluetooth"
export default function QuickSettings() {
  const [OverlayView, setOverlayView] = createState(false)
  const [PowerMenuView, setPowerMenuView] = createState(false)
  const [WifiView, setWifiView] = createState(false)
  const [BluetoothView, setBluetoothView] = createState(false)
  let popoverRef: Gtk.Popover;
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
	  <TopButton getPopoverRef={() => popoverRef} setPowerMenuView={setPowerMenuView} />
  	  <Sliders/>
	  <QuickToggles setWifiView={setWifiView} setBluetoothView={setBluetoothView} />
	  <Notifications />
      	</box>
	<box $type="overlay" visible = {PowerMenuView}>
	  <PowerPage PowerMenuView={PowerMenuView} setPowerMenuView={setPowerMenuView} getPopoverRef={() => popoverRef} />
	</box>
	<box $type="overlay" visible = {WifiView}>
	  <WifiPage WifiView={WifiView} setWifiView={setWifiView}/>
	</box>
        <box $type="overlay" visible = {BluetoothView}>
	  <BluetoothPage BluetoothView={BluetoothView} setBluetoothView={setBluetoothView}/>
	</box>
      </overlay>
    </popover>
  )
}
