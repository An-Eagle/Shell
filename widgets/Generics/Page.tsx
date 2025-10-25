import app from "ags/gtk4/app"
import { With, Accessor, For, createState, For, createBinding } from "ags"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { PageTitle } from "../Defaults/Style"

interface GenericPageProps {
  children: Gtk.Widget | string | Array<GObject.Object | string>
}
interface PageProps extends GenericPageProps {
  PageView: any
  setPageView: (value: boolean) => void
  icon: string
  label: string
  finaloption: () => void
  finaloptionlabel: string
  Refresh : Gtk.Widget | string | Array<GObject.Object | string>
}
export default function Page({
  PageView,
  setPageView,
  icon,
  label,
  finaloption,
  finaloptionlabel,
  Refresh,
  children,
}: PageProps) {
  return (	
      <box class="overlaypage" orientation={Gtk.Orientation.VERTICAL}>
        <box orientation={Gtk.Orientation.HORIZONTAL}>
          <button onClicked={()=>{setPageView(false)}}>
	    <image iconName="go-previous-symbolic"/>
	  </button>
	  <image class="pageicon" iconName={icon} pixelSize={32}/>
	  <PageTitle label={label}/>
	  <box hexpand={true}/>
	  {Refresh}
       	</box>
	<box vexpand={true} class="pagebuttonbox">
	<box>
          {children}
	</box>
        </box>
	<Gtk.Separator class="pageseparator" orientation={Gtk.Orientation.HORIZONTAL}/>
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

