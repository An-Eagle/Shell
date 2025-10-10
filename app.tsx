#!/usr/bin/env -S ags run
import app from "ags/gtk4/app"
import { createBinding, For, This } from "ags"

import style from "./style.scss"
import Bar from "./widget/Bar"
import NotificationPopups from "./Notifications/NotificationPopups"

app.start({
  css: style,
  icons: "icons/",
  gtkTheme: "Adwaita-dark",
  iconTheme:"Flat-Remix-Green-Dark",
  main() {
    const monitors = createBinding(app, "monitors")
    return (
      <For each={monitors}>
        {(monitor) => (
          <This this={app}>
            <Bar gdkmonitor={monitor} />
            <NotificationPopups gdkmonitor={monitor}/>
          </This>
        )}
      </For>
    )
  },
})
