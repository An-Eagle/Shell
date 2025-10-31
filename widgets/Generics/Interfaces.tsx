import Gtk from "gi://Gtk?version=4.0"
import { Accessor } from "ags"

import Network from "gi://AstalNetwork"
import Wp from "gi://AstalWp"

interface GenericPageProps {
  children: Gtk.Widget | string | Array<GObject.Object | string>
}
export interface PageProps extends GenericPageProps {
  PageView: any
  setPageView: (value: boolean) => void
  icon: string
  label: string
  finaloption: any
  finaloptionlabel: string
  Refresh : Gtk.Widget | string | Array<GObject.Object | string>
}

export interface OSDProps {
  visible : boolean
  icon : any
  label : string
  children: Gtk.Widget | string | Array<GObject.Object | string>
}

export interface PowerButtonProps {
  getPopoverRef: () => Gtk.Popover
  label: string
  command: string
  icon: string
}

export interface WifiDeviceProps {
  wifi: Accessor<any>
  ap: Network.AccessPoint
}

export interface SliderProps {
  audio_interface: Wp.Device
  icon: Function
}

export interface QuickToggleProps {
	setMenu: (arg0: boolean) => void
	icon: any
	label: String
	togglecmd: (arg0: boolean) => void
	subtitle: any
	subvis: any
	toggleactive: any
}