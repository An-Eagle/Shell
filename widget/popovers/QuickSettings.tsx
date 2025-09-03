import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createState } from "ags"
import GObject, { register, property } from "ags/gobject"

import Sliders from "./quicksettings/Sliders"
import QuickToggles from "./quicksettings/QuickToggles"
import TopButton from "./quicksettings/Topbutton"
import Notifications from "./quicksettings/Notifications"

import PowerPage from "./pages/Power"

const BlurBox = GObject.registerClass({
    Properties: {
        'blur-active': GObject.ParamSpec.boolean(
            'blur-active',        // property name in GTK
            'Blur Active',        // nick
            'Whether blur is active', // blurb
            GObject.ParamFlags.READWRITE,
            false // default
        ),
    },
}, class BlurBox extends Gtk.Box {
    get blur_active() {
        return this._blurActive || false;
    }

    set blur_active(val) {
        this._blurActive = val;
        this.queue_draw();
    }

    vfunc_snapshot(snapshot) {
        if (this._blurActive) {
            snapshot.push_blur(10.0);
            super.vfunc_snapshot(snapshot);
            snapshot.pop();
        } else {
            super.vfunc_snapshot(snapshot);
        }
    }
});

export default function QuickSettings() {
  const [OverlayView, setOverlayView] = createState(false)
  let popoverRef: Gtk.Popover;
  return (
    <popover $={(p) => (popoverRef = p)} name="quicksettings" class="quicksettings">
      <BlurBox
        orientation={Gtk.Orientation.VERTICAL}
        blurActive={OverlayView}
      >
	<TopButton getPopoverRef={() => popoverRef} OverlayView={OverlayView} setOverlayView={setOverlayView} />
	<Sliders/>
	<QuickToggles OverlayView={OverlayView} setOverlayView={setOverlayView} />
	<Notifications OverlayView={OverlayView} setOverlayView={setOverlayView} />
      </BlurBox>
    </popover>
  )
}
