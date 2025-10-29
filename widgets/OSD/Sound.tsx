import Gtk from "gi://Gtk?version=4.0"
import { createBinding, createState, createComputed, onCleanup } from "gnim"
import { timeout } from "ags/time"
import { SliderProps } from "../Generics/Interfaces"
import Wp from "gi://AstalWp"
import { SliderOSD } from "../Generics/OSD"
const wp = Wp.get_default()

export default function Sound() {
    const speaker = wp.audio.defaultSpeaker

    const [AudioChangeVis, setAudioChangeVis] = createState(false)
    let hideTimeout:Timer = null
    const [Label, setLabel] = createState("null")
    const icon = createBinding(speaker, "volumeIcon")
   
	
    const volume  = createComputed([createBinding(speaker, "volume"), createBinding(speaker, "mute")], (v, m) => m ? 0 : v)
    const audiochange = wp.audio.defaultSpeaker.connect("notify::mute", () => {
        setLabel("mute")
        setAudioChangeVis(true)
        if (hideTimeout) hideTimeout.cancel()
        hideTimeout = timeout(2500, () => setAudioChangeVis(false))
        
    })
    const audiomutechange = wp.audio.defaultSpeaker.connect("notify::volume", () => {
        setLabel("volume")
        setAudioChangeVis(true)
        if (hideTimeout) hideTimeout.cancel()
        hideTimeout = timeout(2500, () => setAudioChangeVis(false))
    })
    onCleanup(() => {
        wp.audio.defaultSpeaker.disconnect(audiomutechange)
        wp.audio.defaultSpeaker.disconnect(audiochange)
        hideTimeout.cancel()
    })
    print(volume)
    return (
        <SliderOSD visible={AudioChangeVis} label={Label} icon={icon} fraction={volume}/>
    )
}