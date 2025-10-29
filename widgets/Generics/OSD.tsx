import Gtk from "gi://Gtk?version=4.0"
import app from "ags/gtk4/app"
import { createBinding, For, onCleanup } from "gnim"
import { Astal } from "ags/gtk4"
import { OSDProps } from "./Interfaces"

export default function OSD({ visible, icon, children }: OSDProps) {
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
                        <image class= "osdimage" iconName={icon} pixelSize={28}/>
                        {children}
                    </box>
                </window>
            )}
        </For>
    )
}

interface SliderOSDProps extends OSDProps {
    fraction : number
}

export function SliderOSD({ visible, icon, fraction }: SliderOSDProps) {
    <OSD visible={visible} icon={icon}>
            <Gtk.ProgressBar
                class="osdprogress"
                fraction={fraction}  // value from 0.0 to 1.0
                visible={true}
                valign={Gtk.Align.CENTER}
                halign={Gtk.Align.FILL}
                width_request={120}
                height_request={8}
            />
    </OSD>
}