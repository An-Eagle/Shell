import Gtk from "gi://Gtk?version=4.0"
import { createState } from "gnim"
import { PageTitle } from "../Defaults/Style"
import { PageProps } from "./Interfaces"

export default function Page({
	icon,
	label,
	finaloption,
	finaloptionlabel,
	Refresh,
	children,
}: PageProps) {

	return (
		<box class="overlaypage" orientation={Gtk.Orientation.VERTICAL} hexpand
			vexpand
		>
			<box  orientation={Gtk.Orientation.HORIZONTAL}>
				<image class="pageicon" iconName={icon} pixelSize={32} />
				<PageTitle label={label} />
				<box hexpand={true} />
				{Refresh}
			</box>
			<box vexpand={true} class="pagebuttonbox">
				<box>
					{children}
				</box>
			</box>
			<Gtk.Separator class="pageseparator" orientation={Gtk.Orientation.HORIZONTAL} />
			<box class="settingsbuttonbox">
				<button
					class="pagebutton"
					onClicked={finaloption}
				>
					<label
						label={finaloptionlabel}
						halign={Gtk.Align.START}
						hexpand={true}
					/>
				</button>
			</box>


		</box>
	)
}

