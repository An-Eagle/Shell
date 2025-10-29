import Gtk from "gi://Gtk?version=4.0"
import { execAsync } from "ags/process"
import Page from "../../../Generics/Page"
import { PowerButtonProps } from "../../../Generics/Interfaces"

async function Logout({ getPopoverRef }: PowerButtonProps) {
	try {
		const popover = getPopoverRef();
		print (popover)
		if (popover) {
			popover.popdown();
		}
		await execAsync(`distrobox-host-exec niri msg action quit`)
	} catch (error) {
		console.error("Logout error :"  +error)
	}
}

function PowerButton({ getPopoverRef, label, command }: PowerButtonProps) {
	return (
		<button class="pagebutton"
			onClicked={async () => {
				const popover = getPopoverRef()
				if (popover) {
					popover.popdown();
				}
				execAsync(command)
			}}>
			<label
				halign={Gtk.Align.START}
				label={label}
			/>
		</button>
	)
}

export default function PowerMenu({ PowerMenuView, setPowerMenuView, getPopoverRef }) {
	const popover = getPopoverRef()
	return (
		<Page PageView={PowerMenuView} setPageView={setPowerMenuView} icon={"system-shutdown-symbolic"} label={"Power Off"} finaloption={() => Logout({getPopoverRef})} finaloptionlabel="Log out">
			<box class="pagebuttonbox" orientation={Gtk.Orientation.VERTICAL} hexpand={true}>
				<PowerButton getPopoverRef={getPopoverRef} label={"Suspend"} command={`distrobox-host-exec systemctl suspend`} />
				<PowerButton getPopoverRef={getPopoverRef} label={"Reboot"} command={`distrobox-host-exec systemctl reboot`} />
				<PowerButton getPopoverRef={getPopoverRef} label={"Poweroff"} command={`distrobox-host-exec systemctl poweroff`} />
			</box>
		</Page>
	)
}
