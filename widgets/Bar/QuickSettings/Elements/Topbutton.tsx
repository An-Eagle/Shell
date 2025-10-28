import Gtk from "gi://Gtk?version=4.0"
import { execAsync } from "ags/process"
import { PowerButtonProps } from "../../../Generics/Interfaces"

function TopButton({ getPopoverRef, command, icon }: PowerButtonProps) {
  return (
    <button
      class="topbutton"
      onClicked={() => {
        const popover = getPopoverRef();
        if (popover) {
          popover.popdown();
        }
        execAsync(command)
      }}
    >
      <image class="topicon" iconName={icon} />
    </button>
  )
}

export default function TopButtons({ getPopoverRef, setPowerMenuView }) {
  return (
    <box class="topbox" orientation={Gtk.Orientation.HORIZONTAL}>
      <TopButton getPopoverRef={getPopoverRef} command={`distrobox-host-exec niri msg action screenshot`} icon={"screenshooter-symbolic"}/>
      <box hexpand={true} />
      <TopButton getPopoverRef={getPopoverRef} command={`distrobox-host-exec hyprlock`} icon={"changes-prevent-symbolic"}/>
      <button class="topbutton" onClicked={() => {
        setPowerMenuView(true)
      }}>
        <image class="topicon" iconName="system-shutdown-symbolic" pixelSize={24} />
      </button>
    </box>
  )
}
