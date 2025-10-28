import app from "ags/gtk4/app"
import Gtk from "gi://Gtk?version=4.0"
import { Astal } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import Notification from "../Generics/Notification"
import { createBinding, For, createState, onCleanup } from "ags"
import { timeout } from "ags/time"

export default function NotificationPopups() {
  const monitors = createBinding(app, "monitors")

  const notifd = Notifd.get_default()

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

  notifd.set_ignore_timeout(true);
  
  const resolvedHandler = notifd.connect("resolved", (_, id) => {
    setNotifications((ns) => ns.filter((n) => n.id !== id))
  })

  onCleanup(() => {
    notifd.disconnect(notifiedHandler)
    notifd.disconnect(resolvedHandler)
    notifd.set_ignore_timeout(false);
  })
  let notiftimeout
  return (
    <For each={monitors}>
      {(monitor) => (
        <window
          $={(self) => onCleanup(() => self.destroy())}
          class="NotificationPopups"
          gdkmonitor={monitor}
          visible={notifications((ns) => ns.length > 0)}
          anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.CENTER}
        >
          <box orientation={Gtk.Orientation.VERTICAL}>
            <For each={notifications((ns) => ns.slice(0,1))}>
              {(notification) => {
	        notiftimeout = notification.expireTimeout
                if (notiftimeout > 0) {
                  timeout(notiftimeout, () => {
                    setNotifications((ns) => ns.filter((n) => n.id !== notification.id))
		  });
		}
		else if (notiftimeout === 0 || notiftimeout === -1) {
                  timeout(5000, () => {
                    setNotifications((ns) => ns.filter((n) => n.id !== notification.id))
                  });
		}
	        return (
	          <Notification notification={notification} popup_notification={true}/>
		)
	      }}
            </For>
          </box>
        </window>
      )}
    </For>
  )
}
