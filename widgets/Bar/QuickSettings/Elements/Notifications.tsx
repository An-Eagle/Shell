import app from "ags/gtk4/app"
import Gtk from "gi://Gtk?version=4.0"
import { createBinding, For, createState, onCleanup } from "ags"
import Notifd from "gi://AstalNotifd"

import Notification from "../../../Generics/Notification"

const notifd = Notifd.get_default()


export default function Notifications () {
  const monitors = createBinding(app, "monitors")

  const [notifications, setNotifications] = createState(
    new Array<Notifd.Notification>(),
  )

  const notifiedHandler = notifd.connect("notified", (_, id, replaced) => {

    const notification = notifd.get_notification(id)
    
    if (replaced && notifications.get().some((n:Notifd.Notification) => n.id === id)) {
      setNotifications((ns:Notifd.Notification) => ns.map((n:Notifd.Notification) => (n.id === id ? notification : n)))
    } else {
      setNotifications((ns:Notifd.Notification) => [notification, ...ns])
    }
  })
  
  const resolvedHandler = notifd.connect("resolved", (_, id) => {
    setNotifications((ns:Notifd.Notification) => ns.filter((n:Notifd.Notification) => n.id !== id))
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
	    notifd.notifications.forEach((notification:Notifd.Notification) => {
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
      <box visible={createBinding(notifd, "notifications").as((notifications:Notifd.Notification) => notifications == null || notifications.length === 0)}class="nonotificationbox" orientation={Gtk.Orientation.VERTICAL}>
        <image class="nonotificationicon" iconName="no-notifications-symbolic" pixelSize={24}/>
        <label label="No Notifications"/>
      </box>
      <box orientation={Gtk.Orientation.VERTICAL}>
	      <For each={notifications}>
	        {(notification:Notifd.Notification) => <Notification notification={notification} />}
	      </For>
      </box>
    </box>
  )
}
