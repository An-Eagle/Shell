#!/usr/bin/env -S ags run
import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/Bar"

import NotificationPopups from "./Notifications/NotificationPopups"

app.start({
  instanceName: "bar",
  css: style,
  icons: "icons/",
  gtkTheme: "Adwaita-dark",
  main() {
    app.get_monitors().map(Bar)

  },
})
