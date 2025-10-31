import Gtk from "gi://Gtk?version=4.0"
import app from "ags/gtk4/app"
import { createBinding, For, onCleanup } from "gnim"
import { Astal } from "ags/gtk4"
import { OSDProps } from "./Interfaces"

import { OSDTitle } from "../Defaults/Style"

export function OSD({ visible, icon, children }: OSDProps) {
    const monitors = createBinding(app, "monitors")
    return (
        <For each={monitors}>
            {(monitor) => (
                <window
                    $={(self) => onCleanup(() => self.destroy())}
                    class="NotificationPopups"
                    gdkmonitor={monitor}
                    visible={visible}
                    anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.CENTER}
                >
                    <box
                        widthRequest={200}
                        heightRequest={60}
                        class={`osd`}
                        orientation={Gtk.Orientation.HORIZONTAL}
                    >
                        <image class="osdimage" iconName={icon} pixelSize={32} />
                        {children}
                    </box>
                </window>
            )}
        </For>
    )
}

export function TextOSD({ visible, label }: OSDProps) {
    return (
        <OSDTitle visible={visible} label={label}/>
    )
}

interface SliderOSDProps extends OSDProps {
    fraction: number
}

export function SliderOSD({ visible, fraction }: SliderOSDProps) {
    return (
        <Gtk.ProgressBar
            class="osdprogress"
            fraction={fraction}  // value from 0.0 to 1.0
            visible={visible}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.FILL}
            width_request={192}
            height_request={16}
        />
    )
}