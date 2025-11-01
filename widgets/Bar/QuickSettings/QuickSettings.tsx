import Gtk from "gi://Gtk?version=4.0"
import { createState } from "ags"

import Sliders from "./Elements/Sliders"
import QuickToggles from "./Elements/QuickToggles"
import TopButtons from "./Elements/Topbutton"
import Notifications from "./Elements/Notifications"

import PowerPage from "./Pages/Power"
import WifiPage from "./Pages/Wifi"
import BluetoothPage from "./Pages/Bluetooth"

function ScrollController({ getBox, setPageView }: any) {
  let newOffset = 0
  return (
    <Gtk.EventControllerScroll
      flags={Gtk.EventControllerScrollFlags.BOTH_AXES}
      $={(ctrl) => ctrl.set_propagation_phase(Gtk.PropagationPhase.CAPTURE)}
      onScroll={(ctrl, dx, dy) => {
        const current = getBox().get_margin_start()
        newOffset = current + dx * -2
        // Clamp the offset to [0, 440]
        if (newOffset > 440) newOffset = 440
        if (newOffset < 0) newOffset = 0
        getBox().set_margin_start(newOffset)
      }}
      onScrollEnd={() => {
        if (newOffset >= 380) {
          setPageView(false)
          getBox().set_margin_start(0)
          newOffset = 0
        }
        else {
          getBox().set_margin_start(0)
          newOffset = 0
        }
      }}
    />
  )
}

export default function QuickSettings() {
  const [PowerMenuView, setPowerMenuView] = createState(false)
  const [WifiView, setWifiView] = createState(false)
  const [BluetoothView, setBluetoothView] = createState(false)
  let popoverRef: Gtk.Popover;
  //The Box is the reference to the GtkBox, while the offset controls the amount of margin that it is offset by
  let PowerBox
  let WifiBox
  let wifiOffset = 0
  let BluetoothBox
  let bluetoothOffset = 0
  return (
    <popover
      $={(p: Gtk.Popover) => (popoverRef = p)}
      onHide={(self) => {
        setPowerMenuView(false)
        setWifiView(false)
        setBluetoothView(false)
      }}
      name="quicksettings"
      class="quicksettings"
      canTarget={true}
    >



      <overlay >
        <box orientation={Gtk.Orientation.VERTICAL} >
          <TopButtons getPopoverRef={() => popoverRef} setPowerMenuView={setPowerMenuView} />
          <Sliders />
          <QuickToggles setWifiView={setWifiView} setBluetoothView={setBluetoothView} />
          <Notifications />
        </box>
        <box $type="overlay" visible={PowerMenuView} class="overlaybackground">
          <ScrollController getBox={() => PowerBox} setPageView={setPowerMenuView} />
          <box $={(w) => { PowerBox = w }} >
            <PowerPage PowerMenuView={PowerMenuView} setPowerMenuView={setPowerMenuView} getPopoverRef={() => popoverRef} />
          </box>
        </box>
        <box $type="overlay" visible={WifiView} class="overlaybackground">
          <ScrollController getBox={() => WifiBox} setPageView={setWifiView} />
          <box $={(w) => { WifiBox = w }} >
            <WifiPage WifiView={WifiView} setWifiView={setWifiView} />
          </box>
        </box>
        <box $type="overlay" visible={BluetoothView} class="overlaybackground">
          <ScrollController getBox={() => BluetoothBox} setPageView={setBluetoothView} />
          <box $={(w) => { BluetoothBox = w }}>
            <BluetoothPage BluetoothView={BluetoothView} setBluetoothView={setBluetoothView} />
          </box>
        </box>
      </overlay>
    </popover>
  )
}
