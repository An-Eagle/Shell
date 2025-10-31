import { With, For, createBinding } from "ags"
import Gtk from "gi://Gtk?version=4.0"
import Network from "gi://AstalNetwork"
import { execAsync } from "ags/process"
import Page from "../../../Generics/Page"
import {WifiDeviceProps} from "../../../Generics/Interfaces"

const network = Network.get_default()


async function ConnectAP(ap: Network.AccessPoint) {
  try {
    await execAsync(`distrobox-host-exec nmcli d wifi connect ${ap.bssid}`)
  } catch (error:any) {
    if (error.message?.includes("Secrets were required")) {
      log("Implement Password Prompt here");
    } else {
      logError(error);
    }
    // you can implement a popup asking for password here
    console.error(error)
  }
}
async function NetSettings() {
  try {
    await execAsync(`nm-connection-editor`)
  } catch (error) {
    console.error("nm-connection-editor error :" + error)
  }
}

function WifiRefresh() {
  return (
    <button
      class="topbutton"
      onClicked={() => network.wifi.scan()}
      halign={Gtk.Align.END}
      hexpand={false}
      vexpand={false}
    >
      <box halign={Gtk.Align.CENTER}>
        <image visible={createBinding(network.wifi, "scanning").as(scanning => !scanning)} iconName="object-rotate-right-symbolic" />
        <image visible={createBinding(network.wifi, "scanning")} iconName="media-playback-stop-symbolic" />
      </box>
    </button>
  )
}


function WifiDevice({wifi, ap} : WifiDeviceProps) {
  return (
    <button
      class="pagebutton"
      onClicked={() => {
        ConnectAP(ap)
      }}>
      <box spacing={4} hexpand={true}>
        <image iconName={createBinding(ap, "iconName")} />
        <label label={createBinding(ap, "ssid")} />
        <image
          iconName="object-select-symbolic"
          visible={createBinding(
            wifi,
            "activeAccessPoint",
          )((active) => active === ap)}
        />
      </box>
    </button>
  )
}

export default function Wifi({ WifiView, setWifiView }) {

  const wifi = createBinding(network, "wifi")

  const sorted = (arr: Array<Network.AccessPoint>) => {
    const seen = new Map<string, Network.AccessPoint>();

    for (const ap of arr) {
      if (!ap.ssid) continue;
      const existing = seen.get(ap.ssid);
      if (!existing || ap.strength > existing.strength) {
        seen.set(ap.ssid, ap);
      }
    }

    return Array.from(seen.values()).sort((a, b) => b.strength - a.strength);
  };
  return (
    <Page PageView={WifiView} setPageView={setWifiView} icon={"network-wireless-signal-excellent-symbolic"} label={"Wi-Fi"} finaloption={NetSettings} finaloptionlabel="Wifi Settings" Refresh={<WifiRefresh />}  >
      <With value={wifi}>
        {(wifi) =>
          wifi && (
            <box>
              <box halign={Gtk.Align.CENTER} visible={createBinding(wifi, "enabled").as((p) => (!p))} hexpand>
				        <label class="pagetitle" label="Wi-Fi Disabled" />
			        </box>
              <box halign={Gtk.Align.CENTER} visible={createBinding(wifi, "scanning")} hexpand>
                <label class="pagetitle" label="Scanning..." />
              </box>
              <scrolledwindow>
                <box
                  visible={createBinding(wifi, "scanning").as(scanning => !scanning)}
                  orientation={Gtk.Orientation.VERTICAL}>
                  <For each={createBinding(wifi, "accessPoints")(sorted)}>
                    {(ap: Network.AccessPoint) => {
                      return (
                        WifiDevice({wifi, ap})
                      )
                    }
                    }
                  </For>
                </box>
              </scrolledwindow>
            </box>
          )
        }
      </With>
    </Page>
  )
}

