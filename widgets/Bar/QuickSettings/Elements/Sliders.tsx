import Gtk from "gi://Gtk?version=4.0"
import { createBinding, createComputed } from "ags"
import { SliderProps } from "../../../Generics/Interfaces"
import Wp from "gi://AstalWp"


function Slider({audio_interface, icon} : SliderProps ) {
	const volume = createBinding(audio_interface, "volume")
	const mute = createBinding(audio_interface, "mute")
	return (
		<box
			orientation={Gtk.Orientation.HORIZONTAL}
		>
			<togglebutton
				class="togglemute" name="Toggle mute speaker"
				active={createBinding(audio_interface, "mute")}
				onToggled={({ active }) => { audio_interface.set_mute(active) }}
			>
				<image iconName={icon} pixelSize={20} />
			</togglebutton>
			<slider
				class="slider"
				hexpand={true}
				value={createComputed([volume, mute], (v, m) => m ? 0 : v * 100)}
				min={0}
				max={100}
				onChangeValue={({ value }) => {
					if (audio_interface.mute) {
						audio_interface.set_mute(false);
						setTimeout(() => {
							audio_interface.set_volume(value / 100);
						}, 25);
					} else {
						audio_interface.set_volume(value / 100);
					}
				}}
			/>
		</box>
	)
}

export default function Sliders() {
	const wp = Wp.get_default()

	const micicon = createBinding(wp.audio.defaultMicrophone, "mute").as((mute : boolean) => mute === true ? "microphone-disabled-symbolic" : "microphone-sensitivity-high-symbolic")
	const speakericon = createBinding(wp.audio.defaultSpeaker, "volumeIcon")

	return (
		<box orientation={Gtk.Orientation.VERTICAL} >
			<Slider audio_interface={wp.audio.defaultSpeaker} icon={speakericon}/>
			<Slider audio_interface={wp.audio.defaultMicrophone} icon={micicon}/>
		</box>
	)
}
