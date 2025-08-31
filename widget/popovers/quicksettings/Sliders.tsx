import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { With, Accessor, For, createState, For, createBinding, createComputed } from "ags"

import Wp from "gi://AstalWp"
export default function Sliders() {
  const wp = Wp.get_default()
  const default_speaker = wp.audio.default_speaker
  const default_microphone = wp.audio.default_microphone
  const volume = createBinding(default_speaker, "volume")
  const mute = createBinding(default_speaker, "mute")
  const micvolume = createBinding(default_microphone, "volume")
  const micmute = createBinding(default_microphone, "mute")

return(
  <box orientation={Gtk.Orientation.VERTICAL} >
    <box 
      orientation={Gtk.Orientation.HORIZONTAL}
    >
      <togglebutton
	class = "togglemute" name = "Toggle mute speaker"
	active={createBinding(default_speaker, "mute")}
	onToggled={({ active }) => {default_speaker.set_mute(active)}}
      >
	<image iconName= {createBinding(default_speaker, "volumeIcon")}/>
      </togglebutton>
      <slider
	class="slider"
	hexpand={true}
	value={createComputed([volume, mute], (v, m) => m ? 0 : v*100)}
	min={0}
	max={100}
	onChangeValue={({ value }) => {
	  if (default_speaker.mute) {
	    default_speaker.set_mute(false);
	    setTimeout(() => {
	      default_speaker.set_volume(value / 100);
	    }, 25);
	  } else {
	    default_speaker.set_volume(value / 100);
	  }
	}}
      />
    </box>
    <box 
      orientation={Gtk.Orientation.HORIZONTAL}
    >
      <togglebutton
	class = "togglemute" name = "Toggle mute microphone"
	active={createBinding(default_microphone, "mute")}
	onToggled={({ active }) => {default_microphone.set_mute(active)}}
      >
	<image iconName= {createBinding(default_microphone, "volumeIcon")}/>
      </togglebutton>
      <slider
	class = "slider"
	hexpand={true}
	value={createComputed([micvolume, micmute], (v, m) => m ? 0 : v*100)}
	min={0}
	max={100}
	onChangeValue={({ value }) => {
	  if (default_microphone.mute) {
	    default_microphone.set_mute(false);
	    setTimeout(() => {
	      default_microphone.set_volume(value / 100);
	    }, 25);
	  } else {
	    default_microphone.set_volume(value / 100);
	  }
	}}
      />
    </box>
  </box>
)}
