import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createBinding, For, createState, onCleanup } from "ags"
import Notifd from "gi://AstalNotifd"

import Notification from "../../../Notifications/Notification"
import { PageTitle } from "../../defaults/Style"

const notifd = Notifd.get_default()

print(notifd.notifications)

export default function Notifications ({ OverlayView, setOverlayView }) {
  const monitors = createBinding(app, "monitors")

  const [notifications, setNotifications] = createState(
    new Array<Notifd.Notification>(),
  )

  const notifiedHandler = notifd.connect("notified", (_, id, replaced) => {

    const notification = notifd.get_notification(id)
    
    if (replaced && notifications.get().some((n) => n.id === id)) {
      setNotifications((ns) => ns.map((n) => (n.id === id ? notification : n)))
    } else {
      setNotifications((ns) => [notification, ...ns])
    }
  })
  
  const resolvedHandler = notifd.connect("resolved", (_, id) => {
    setNotifications((ns) => ns.filter((n) => n.id !== id))
  })

  onCleanup(() => {
    notifd.disconnect(notifiedHandler)
    notifd.disconnect(resolvedHandler)
  })
  return (
    <box orientation={Gtk.Orientation.VERTICAL}>
      <box orientation={Gtk.Orientation.HORIZONTAL}>
        <label class = "notificationlabel" label= "Notifications"/>
	<box hexpand={true}/>
        <button
	  class = "clearbutton"
	  halign = {Gtk.Align.END}
	  onClicked= { () => {
	    notifd.notifications.forEach((notification) => {
	      notification.dismiss()
	    })
	  }}
	>
	  <box>
	    <image class ="clearicon" iconName="user-trash-symbolic"/>
	    <label label="Clear" />
	  </box>
	</button>
      </box>
      <box visible={createBinding(notifd, "notifications").as(notifications => notifications == null || notifications.length === 0)}class="nonotificationbox" orientation={Gtk.Orientation.VERTICAL}>
        <image class="nonotificationicon" iconName="no-notifications-symbolic" pixelSize={24}/>
        <label label="No Notifications"/>
      </box>
      <box orientation={Gtk.Orientation.VERTICAL}>
	<For each={notifications}>
	  {(notification) => <Notification notification={notification} />}
	</For>
      </box>
    </box>
  )
}
