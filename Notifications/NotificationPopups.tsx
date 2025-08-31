import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import Notification from "./Notification"
import { createBinding, For, createState, onCleanup } from "ags"

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
  notifd.set_ignore_timeout(true)
  const resolvedHandler = notifd.connect("resolved", (_, id) => {
    setNotifications((ns) => ns.filter((n) => n.id !== id))
  })

  onCleanup(() => {
    notifd.disconnect(notifiedHandler)
    notifd.disconnect(resolvedHandler)
  })

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
            <For each={notifications}>
              {(notification) => <Notification notification={notification} popup_notification={true}/>}
            </For>
          </box>
        </window>
      )}
    </For>
  )
}
