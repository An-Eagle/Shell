import { createBinding } from "ags"

import Network from "gi://AstalNetwork"
const network = Network.get_default()

import AstalBattery from "gi://AstalBattery"
const battery = AstalBattery.get_default()

import Wp from "gi://AstalWp"
const wp = Wp.get_default()

import Niri from "gi://AstalNiri";
const niri = Niri.get_default();

function Layout() {
  return ( 
    createBinding(niri, "keyboardLayoutIdx").as(idx => idx === 0 ? "En" : "Fr")
  )
}

export default function SystemStatus() {
  const percent = createBinding(
    battery,
    "percentage",
  )((p) => `${Math.floor(p * 100)}%`)

  return (
    <box 
      name="System status"
      class="sysstatus"
    >
      <label label = <Layout/>/>
      <image class="activemicrophone" visible ={createBinding(wp.audio.default_microphone, "mute").as(m => !m)} iconName="microphone-sensitivity-high-symbolic" pixelSize={12} />
      <image iconName={createBinding(wp.audio.default_speaker, "volumeIcon")}pixelSize={20}/>
      <image iconName={createBinding(network.wifi, "icon-name")}pixelSize={20}/>
      <image iconName={createBinding(battery, "iconName")} pixelSize={20}/>
      <label label={percent} />
    </box>
  )
}

