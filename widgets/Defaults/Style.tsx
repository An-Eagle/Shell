import Pango from "gi://Pango"

export function QuickToggleTitle(props){
  return (
    <label
      class="quicktoggletitle"
      halign
      maxWidthChars={12}
      ellipsize={Pango.EllipsizeMode.END}
      {...props}
    />
  )
}
export function QuickToggleSubtitle(props) {
  return (
    <label
      class="quicktogglesubtitle"
      halign
      hexpand={false}
      maxWidthChars={15}
      ellipsize={Pango.EllipsizeMode.END}
      {...props}
    />
  )
}
export function QuickToggleHasMenuTitle(props){
  return (
    <label
      class="quicktoggletitle"
      halign
      maxWidthChars={9}
      ellipsize={Pango.EllipsizeMode.END}
      {...props}
    />
  )
}
export function QuickToggleHasMenuSubtitle(props) {
  return (
    <label
      class="quicktogglesubtitle"
      halign
      hexpand={false}
      maxWidthChars={10}
      ellipsize={Pango.EllipsizeMode.END}
      {...props}
    />
  )
}
export function PageTitle(props){
  return (
    <label
      class="pagetitle"
      halign
      maxWidthChars={12}
      ellipsize={Pango.EllipsizeMode.END}
      {...props}
    />
  )
}

export function OSDTitle(props) {
  return (
     <label
      class="osdtitle"
      halign
      maxWidthChars={24}
      ellipsize={Pango.EllipsizeMode.END}
      {...props}
    />
  )
}