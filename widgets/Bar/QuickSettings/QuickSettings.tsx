import Gtk from "gi://Gtk?version=4.0"
import { createState } from "ags"

import Sliders from "./Elements/Sliders"
import QuickToggles from "./Elements/QuickToggles"
import TopButtons from "./Elements/Topbutton"
import Notifications from "./Elements/Notifications"

import PowerPage from "./Pages/Power"
import WifiPage from "./Pages/Wifi"
import BluetoothPage from "./Pages/Bluetooth"

export default function QuickSettings() {
  const [PowerMenuView, setPowerMenuView] = createState(false)
  const [WifiView, setWifiView] = createState(false)
  const [BluetoothView, setBluetoothView] = createState(false)
  let popoverRef: Gtk.Popover;
  //The Box is the reference to the GtkBox, while the offset controls the amount of margin that it is offset by
  let PowerBox
  let powerOffset = 0
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
          <Gtk.EventControllerScroll
            flags={Gtk.EventControllerScrollFlags.BOTH_AXES}
            $={(ctrl) => ctrl.set_propagation_phase(Gtk.PropagationPhase.CAPTURE)}
            onScroll={(ctrl, dx, dy) => {
              const current = PowerBox.get_margin_start()
              powerOffset = current + dx * -2
              // Clamp the offset to [0, 440]
              if (powerOffset > 440) powerOffset = 440
              if (powerOffset < 0) powerOffset = 0
              PowerBox.set_margin_start(powerOffset)
            }}
            onScrollEnd={() => {
              if (powerOffset >= 380) {
                setPowerMenuView(false)
                PowerBox.set_margin_start(0)
                powerOffset=0
              }
              else {
                PowerBox.set_margin_start(0)
                powerOffset=0
              }
            }}
          />
          <box $={(w) => { PowerBox = w }} >
            <PowerPage PowerMenuView={PowerMenuView} setPowerMenuView={setPowerMenuView} getPopoverRef={() => popoverRef} />
          </box>
        </box>
        <box $type="overlay" visible={WifiView} class="overlaybackground">
                <Gtk.EventControllerScroll
        flags={Gtk.EventControllerScrollFlags.BOTH_AXES}
        onScroll={(ctrl, dx, dy) => {
          const current = WifiBox.get_margin_start()
          wifiOffset = current + dx * -2
          // Clamp the offset to [-200, 200]
          if (wifiOffset > 440) wifiOffset = 440
          if (wifiOffset < 0) wifiOffset = 0

          WifiBox.set_margin_start(wifiOffset)
        }}
        onScrollEnd={() => {
          if (wifiOffset >= 380) {
            setWifiView(false)
            WifiBox.set_margin_start(0)
            wifiOffset=0
          }
          else {
            WifiBox.set_margin_start(0)
            wifiOffset=0
          }
        }}
      />
          <box $={(w) => { WifiBox = w }} >
            <WifiPage WifiView={WifiView} setWifiView={setWifiView} />
          </box>
        </box>
        <box $type="overlay" visible={BluetoothView} class="overlaybackground">
                <Gtk.EventControllerScroll
        flags={Gtk.EventControllerScrollFlags.BOTH_AXES}
        onScroll={(ctrl, dx, dy) => {
          const current = BluetoothBox.get_margin_start()
          bluetoothOffset = current + dx * -2

          // Clamp the offset to [-200, 200]
          if (bluetoothOffset > 440) bluetoothOffset = 440
          if (bluetoothOffset < 0) bluetoothOffset = 0

          BluetoothBox.set_margin_start(bluetoothOffset)
        }}
        onScrollEnd={() => {
          if (bluetoothOffset >= 380) {
            setBluetoothView(false)
            BluetoothBox.set_margin_start(0)
            bluetoothOffset=0
          }
          else {
            BluetoothBox.set_margin_start(0)
            bluetoothOffset=0
          }
        }}
      />
          <box $={(w) => { BluetoothBox = w }}>
            <BluetoothPage BluetoothView={BluetoothView} setBluetoothView={setBluetoothView} />
          </box>
        </box>
      </overlay>
    </popover>
  )
}
