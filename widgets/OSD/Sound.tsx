import { createBinding, createState, createComputed, onCleanup } from "gnim"
import { timeout } from "ags/time"
import Wp from "gi://AstalWp"
const wp = Wp.get_default()
import Bluetooth from "gi://AstalBluetooth"
const bluetooth = Bluetooth.get_default()
import Network from "gi://AstalNetwork"
const network = Network.get_default()

import { OSD, SliderOSD, TextOSD } from "../Generics/OSD"

export default function Sound() {
    //Universal variables
    let hideTimeout: Timer = null
    const [Label, setLabel] = createState("null")
    const [ChangeVis, setChangeVis] = createState(false)
    const [AudioChangeVis, setAudioChangeVis] = createState(false)
    const [BluetoothChangeVis, setBluetoothChangeVis] = createState(false)
    const [NetworkChangeVis, setNetworkChangeVis] = createState(false)
    //Audio variables
    const speaker = wp.audio.defaultSpeaker
    const volume = createComputed([createBinding(speaker, "volume"), createBinding(speaker, "mute")], (v, m) => m ? 0 : v)

    //Icon variables
    const audioicon = createBinding(speaker, "volumeIcon")
    const bluetoothicon = createBinding(bluetooth.adapter, "powered").as((p) => {
        if (p) return ("bluetooth-symbolic")
        else return ("bluetooth-disabled-symbolic")
    })
    const networkicon = createBinding(network.wifi, "enabled").as((e) => {
        if(e) return("network-wireless-signal-excellent-symbolic")
        else return ("network-wireless-offline-symbolic")
    })
    const icon = createComputed([createBinding(speaker, "mute"), createBinding(bluetooth.adapter, "powered"), createBinding(network.wifi, "enabled"), AudioChangeVis, BluetoothChangeVis, NetworkChangeVis], (a, b, n, av, bv, nv) => {
        if(a&&av) return(audioicon.get())
        if(!a&&av) return (audioicon.get())
        if(b&&bv) return(bluetoothicon.get())
        if(!b&&bv) return (bluetoothicon.get())
        if(n&&nv) return(networkicon.get())
        if(!n&&nv) return(networkicon.get())
        else return ("question-mark-symbolic")
    })
    //Label variables
    //Audio listeners
    const audiochange = wp.audio.defaultSpeaker.connect("notify::mute", () => {
        setChangeVis(true)
        setAudioChangeVis(true)
        setBluetoothChangeVis(false)
        setNetworkChangeVis(false)
        if (hideTimeout) hideTimeout.cancel()
        hideTimeout = timeout(2500, () => setChangeVis(false))

    })
    const audiomutechange = wp.audio.defaultSpeaker.connect("notify::volume", () => {
        setChangeVis(true)
        setAudioChangeVis(true)
        setBluetoothChangeVis(false)
        setNetworkChangeVis(false)
        if (hideTimeout) hideTimeout.cancel()
        hideTimeout = timeout(2500, () => setChangeVis(false))
    })
    //Bluetooth Listeners
    const bluetoothchange = bluetooth.adapter.connect("notify::powered", () => {
        if(bluetooth.adapter.powered) setLabel("Bluetooth Enabled")
        else setLabel("Bluetooth Disabled")
        setChangeVis(true)
        setAudioChangeVis(false)
        setBluetoothChangeVis(true)
        setNetworkChangeVis(false)
        if (hideTimeout) hideTimeout.cancel()
        hideTimeout = timeout(2500, () => setChangeVis(false))
    })
    //Network Listeners
    const networkchange = network.wifi.connect("notify::enabled", () => {
        if (network.wifi.enabled) setLabel("Wi-Fi Enabled")
        else setLabel("Wi-Fi Disabled")
        setChangeVis(true)
        setAudioChangeVis(false)
        setBluetoothChangeVis(false)
        setNetworkChangeVis(true)
        if (hideTimeout) hideTimeout.cancel()
        hideTimeout = timeout(2500, () => setChangeVis(false))
    })

    onCleanup(() => {
        wp.audio.defaultSpeaker.disconnect(audiomutechange)
        wp.audio.defaultSpeaker.disconnect(audiochange)
        bluetooth.adapter.disconnect(bluetoothchange)
        network.wifi.disconnect(networkchange)
        hideTimeout.cancel()
    })
    return (
        <OSD visible={ChangeVis} icon={icon}>
            <SliderOSD visible={AudioChangeVis} fraction={volume} />
            <TextOSD visible={NetworkChangeVis} label={Label} />
            <TextOSD visible={BluetoothChangeVis} label={Label} />
        </OSD>
    )
}