import app from "ags/gtk4/app"
import { With, Accessor, For, createState, For, createBinding } from "ags"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import Network from "gi://AstalNetwork"
import { execAsync } from "ags/process"
import { PageTitle } from "../../defaults/Style"
const network = Network.get_default()


function ConnectAP () {
}
function ScanAP () {
}
async function NetSettings () {
    try {
      await execAsync(`nm-connection-editor`)
    } catch (error) {
      console.error(error)
    }
}

export default function Wifi() {

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
    <popover class="wifipage" name="Wifi page">
      <box orientation={Gtk.Orientation.VERTICAL}>
        <box orientation={Gtk.Orientation.HORIZONTAL}>
	  <image class="pageicon" iconName="network-wireless-signal-excellent-symbolic" pixelSize={32}/>
	  <PageTitle label="Wifi"/>
	  <box hexpand={true}/>
	  <button 
	    onClicked={() => network.wifi.scan()}
	    halign={Gtk.Align.END}
	  >
	    <box>
	      <image visible = {createBinding(network.wifi, "scanning").as(scanning => !scanning)} iconName="object-rotate-right-symbolic" />
              <image visible = {createBinding(network.wifi, "scanning")} iconName="media-playback-stop-symbolic" />
            </box>
	  </button>
       	</box>
	<box class="pagebuttonbox"visible={wifi(Boolean)}>
          <With value={wifi}>
            {(wifi) =>
              wifi && (
		<box>
		<box
		visible = {createBinding(network.wifi, "scanning")}>
		  <label label="Scanning..."/>
		</box>
                <box
                visible = {createBinding(network.wifi, "scanning").as(scanning => !scanning)}
		orientation={Gtk.Orientation.VERTICAL}>
                  <For each={createBinding(wifi, "accessPoints")(sorted)}>
                    {(ap: Network.AccessPoint) => {
                      return (
		        <button 
			  class="pagebutton"
			  onClicked={() => {
                        }}>
			  <box spacing={4}>
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
		</box>
              )
            }
          </With>
        </box>
	<Gtk.Separator class="pageseparator" orientation={Gtk.Orientation.HORIZONTAL}/>
	<box class="settingsbuttonbox">
	  <button
	    class="pagebutton"
	    onClicked={() => <NetSettings/>}
	  >
	    <label 
	      label="Wifi Settings"
	      halign={Gtk.Align.START}
	      hexpand={true}
	    />
	  </button>
	</box>
      </box>
    </popover>
  )
}

