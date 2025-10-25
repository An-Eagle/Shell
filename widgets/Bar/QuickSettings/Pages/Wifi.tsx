import app from "ags/gtk4/app"
import { With, Accessor, For, createState, For, createBinding } from "ags"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import Network from "gi://AstalNetwork"
import { execAsync } from "ags/process"
import { PageTitle } from "../../../Defaults/Style"
import Page from "../../../Generics/Page"
const network = Network.get_default()


async function ConnectAP (ap: Network.AccessPoint) {
    // connecting to ap is not yet supported
    // https://github.com/Aylur/astal/pull/13
    try {
      await execAsync(`nmcli d wifi connect ${ap.bssid}`)
    } catch (error) {
      // you can implement a popup asking for password here
      console.error(error)
    }
}
async function NetSettings () {
    try {
      await execAsync(`nm-connection-editor`)
    } catch (error) {
      console.error("nm-connection-editor error :" + error)
    }
}

function WifiRefresh() {
  return (
    <button
      onClicked={() => network.wifi.scan()}
      halign={Gtk.Align.END}
    >
      <box>
	<image visible = {createBinding(network.wifi, "scanning").as(scanning => !scanning)} iconName="object-rotate-right-symbolic" />
	<image visible = {createBinding(network.wifi, "scanning")} iconName="media-playback-stop-symbolic" />
      </box>
    </button>
  )
}

export default function Wifi({WifiView, setWifiView}) {

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
	<Page PageView={WifiView} setPageView={setWifiView} icon={"network-wireless-signal-excellent-symbolic"} label={"Wifi"} finaloption={NetSettings} finaloptionlabel="Wifi Settings" Refresh={<WifiRefresh/>}  >
	  <With value={wifi}>
            {(wifi) =>
              wifi && (
	      <box>
                <box
 	          visible = {createBinding(network.wifi, "scanning")}>
	          <label label="Scanning..."/>
		</box>
	        <scrolledwindow>	  
		<box
		  visible = {createBinding(network.wifi, "scanning").as(scanning => !scanning)}
		  orientation={Gtk.Orientation.VERTICAL}>
		    <For each={createBinding(wifi, "accessPoints")(sorted)}>
		      {(ap: Network.AccessPoint) => {
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
			)}
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

