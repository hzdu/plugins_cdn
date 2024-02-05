"use strict";(globalThis.webpackChunkoxyprops=globalThis.webpackChunkoxyprops||[]).push([[3592],{2896:(e,t,l)=>{l.d(t,{c:()=>r});var a=l(8496);const r=({type:e="",children:t})=>{let l;return l="flexcolumn"===e?"FkAMNE0uF3x8UTwaHiF3":"",(0,a.createElement)("article",{className:"gwhUj0ye5s01QeyYbexY "+l},t)}},3592:(e,t,l)=>{l.r(t),l.d(t,{default:()=>le});var a=l(8496),r=l(3396),c=l(3284),o=l(4300),n=l(4639),s=l(2636),i=l(9668),h=l(812);var d=l(1280),m=l(7287),u=l(2896);const g={TITLE:(0,r.__)("Color Schemes","oxyprops"),LOCK_LAB:(0,r.__)("Lock the framework in a single color scheme","oxyprops"),LOCK_HLP:(0,r.__)("If you choose to lock the framework in a single color scheme, you will deactivate light & dark modes responsiveness. All your dark mode specific props will be set to the light version. Unlock to get back to light & dark modes support.","oxyprops"),SCH_TITLE:(0,r.__)("Schemes to load","oxyprops")},p=()=>{const e=(0,d.useContext)(n.c),t=(0,d.useContext)(s.c);return(0,a.createElement)(a.Fragment,null,(0,a.createElement)(u.c,null,(0,a.createElement)("h3",null,g.LOCK_LAB),(0,a.createElement)(m.ToggleControl,{checked:e?.settings.theme.lock_mode,onChange:()=>{t({type:"toggleThemeLockMode"})}}),(0,a.createElement)("p",null,g.LOCK_HLP)),!e?.settings.theme.lock_mode&&(0,a.createElement)(u.c,null,(0,a.createElement)("div",{className:"TIwIQfIPCaxfjOCXFkfe"},(0,a.createElement)("h3",null,g.SCH_TITLE),(0,a.createElement)("div",{className:"cQYod4OJVW_uLne5UI2D"},(0,a.createElement)(m.CheckboxControl,{label:"Light",checked:e?.settings.theme.load_light,onChange:()=>{t({type:"toggleThemeLoadLight"})}}),(0,a.createElement)(m.CheckboxControl,{label:"Dark",checked:e?.settings.theme.load_dark,onChange:()=>{t({type:"toggleThemeLoadDark"})}}),(0,a.createElement)(m.CheckboxControl,{label:"Dim",checked:e?.settings.theme.load_dim,onChange:()=>{t({type:"toggleThemeLoadDim"})}}),(0,a.createElement)(m.CheckboxControl,{label:"Colorful Light",checked:e?.settings.theme.load_colorful_light,onChange:()=>{t({type:"toggleThemeLoadColorfulLight"})}}),(0,a.createElement)(m.CheckboxControl,{label:"Colorful Dark",checked:e?.settings.theme.load_colorful_dark,onChange:()=>{t({type:"toggleThemeLoadColorfulDark"})}})))))};var E=l(5992),$=l(5864),v=l(5140);const f=({color:e,logicalColor:t,action:l})=>{const r=(0,a.useContext)(n.c),c=(0,a.useContext)(s.c);return(0,d.createElement)(x,null,v.WM.map((a=>(0,d.createElement)(m.Button,{onClick:()=>{c({type:l,value:a})},variant:a===r?.settings.theme[e]?"primary":"secondary"},(0,d.createElement)("span",null,a===r?.settings.colors[t]?.weight?a+" ★":a)))))},x=(0,E.cp)(m.ButtonGroup)`
  && {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    justify-content: stretch;
    align-items: stretch;
    && button.components-button {
      display: grid;
      color: var(--o-text-2);
      place-items: center;
      width: 100%;
      border-radius: 0;
      aspect-ratio: var(--o-ratio-widescreen);
      box-shadow: inset 0 0 0 1px var(--o-surface-4);
      outline: 1px solid transparent;
      &.is-primary{
        box-shadow: inset 0 0 0 1px var(--wp-admin-theme-color); 
      }
      &:hover:not(:disabled) {
        box-shadow: inset 0 0 0 1px var(--o-text-1);
        color: var(--o-text-1);
      }
    }
  }
`,_=({logicalColor:e})=>{const t=(0,a.useContext)(n.c);return(0,a.createElement)(a.Fragment,null,(0,a.createElement)("div",{className:"XlzbKcEAQOlDC4OZhaV4"},v.WM.map((l=>(0,a.createElement)("div",{className:"NDgSPPQUrX_QcQquVYwM",style:{backgroundColor:`hsl(${t?.settings.colors[e]?.swatch[l]?.h+" "+t?.settings.colors[e]?.swatch[l]?.s+" "+t?.settings.colors[e]?.swatch[l]?.l})`}})))))};var b=l(1131),w=l(7116),k=l(3768);const C="ugaQ6ttuyJPC_2w9szi7",y=({logical:e,mode:t,color:l})=>{const r=(0,a.useContext)(n.c),c=r?.settings.theme,o=c[l],s=c[`surface1_${t}`],i=c[`surface2_${t}`],h=c[`surface3_${t}`],d=c[`surface4_${t}`],u=r?.settings.colors.canvas.swatch,g=u[s],p=u[i],E=u[h],v=u[d],f=r?.settings.colors[e].swatch,x=f[o],_=new $.c("hsl",[g?.h,g?.s.replaceAll("%",""),g?.l.replaceAll("%","")]),b=new $.c("hsl",[p?.h,p?.s.replaceAll("%",""),p?.l.replaceAll("%","")]),w=new $.c("hsl",[E?.h,E?.s.replaceAll("%",""),E?.l.replaceAll("%","")]),k=new $.c("hsl",[v?.h,v?.s.replaceAll("%",""),v?.l.replaceAll("%","")]),y=new $.c("hsl",[x?.h,x?.s.replaceAll("%",""),x?.l.replaceAll("%","")]),A=_?.contrastAPCA(y),S=b?.contrastAPCA(y),N=w?.contrastAPCA(y),P=k?.contrastAPCA(y),L=y?.contrastWCAG21(_),O=y?.contrastWCAG21(b),M=y?.contrastWCAG21(w),I=y?.contrastWCAG21(k),T=Math.round(10*(A+Number.EPSILON))/10,z=Math.round(10*(S+Number.EPSILON))/10,D=Math.round(10*(N+Number.EPSILON))/10,W=Math.round(10*(P+Number.EPSILON))/10,G=Math.round(10*(L+Number.EPSILON))/10,B=Math.round(10*(O+Number.EPSILON))/10,U=Math.round(10*(M+Number.EPSILON))/10,Q=Math.round(10*(I+Number.EPSILON))/10;return(0,a.createElement)(m.PanelRow,{className:""},(0,a.createElement)("table",{style:{inlineSize:"100%",captionSide:"bottom"}},(0,a.createElement)("caption",null,"Contrast Ratios"),(0,a.createElement)("thead",null,(0,a.createElement)("tr",null,(0,a.createElement)("th",{scope:"column"}),(0,a.createElement)("th",{scope:"column",className:C},"Surface 1"),(0,a.createElement)("th",{scope:"column",className:C},"Surface 2"),(0,a.createElement)("th",{scope:"column",className:C},"Surface 3"),(0,a.createElement)("th",{scope:"column",className:C},"Surface 4"))),(0,a.createElement)("tbody",null,(0,a.createElement)("tr",null,(0,a.createElement)("th",{scope:"row"},"APCA"),(0,a.createElement)("td",{style:{background:`hsl(${g?.h}, ${g?.s}, ${g?.l})`,color:`hsl(${x?.h}, ${x?.s}, ${x?.l})`,textAlign:"center"}},T),(0,a.createElement)("td",{style:{background:`hsl(${p?.h}, ${p?.s}, ${p?.l})`,color:`hsl(${x?.h}, ${x?.s}, ${x?.l})`,textAlign:"center"}},z),(0,a.createElement)("td",{style:{background:`hsl(${E?.h}, ${E?.s}, ${E?.l})`,color:`hsl(${x?.h}, ${x?.s}, ${x?.l})`,textAlign:"center"}},D),(0,a.createElement)("td",{style:{background:`hsl(${v?.h}, ${v?.s}, ${v?.l})`,color:`hsl(${x?.h}, ${x?.s}, ${x?.l})`,textAlign:"center"}},W)),(0,a.createElement)("tr",null,(0,a.createElement)("th",{scope:"row"},"WCAG 2.1"),(0,a.createElement)("td",{style:{background:`hsl(${g?.h}, ${g?.s}, ${g?.l})`,color:`hsl(${x?.h}, ${x?.s}, ${x?.l})`,textAlign:"center"}},G),(0,a.createElement)("td",{style:{background:`hsl(${p?.h}, ${p?.s}, ${p?.l})`,color:`hsl(${x?.h}, ${x?.s}, ${x?.l})`,textAlign:"center"}},B),(0,a.createElement)("td",{style:{background:`hsl(${E?.h}, ${E?.s}, ${E?.l})`,color:`hsl(${x?.h}, ${x?.s}, ${x?.l})`,textAlign:"center"}},U),(0,a.createElement)("td",{style:{background:`hsl(${v?.h}, ${v?.s}, ${v?.l})`,color:`hsl(${x?.h}, ${x?.s}, ${x?.l})`,textAlign:"center"}},Q)))))},A={TITLE:(0,r.__)("Details of your","oxyprops"),light:(0,r.__)("Light","oxyprops"),dark:(0,r.__)("Dark","oxyprops"),dim:(0,r.__)("dim (reduced contrast) mode","oxyprops"),colorful_light:(0,r.__)("colorful light mode (brand replaces canvas)","oxyprops"),colorful_dark:(0,r.__)("colorful dark mode (brand replaces canvas)","oxyprops"),MODE:(0,r.__)("mode","oxyprops")},S=({logical:e,mode:t})=>{const l=(0,w.cp)((0,w.g5)(t)),r=(0,a.useContext)(n.c),c=(0,a.useContext)(s.c),i=(0,k.M7)(),[h,u]=(0,o.E)(((t,l)=>{if("labUpdate"===l.type){t.reference.lab.l=l.value.l,t.reference.lab.a=l.value.a,t.reference.lab.b=l.value.b;let n=(a=(r=l.value.l,o=k.Qb.reduce((function(e,t){return Math.abs(t-r)<Math.abs(e-r)?t:e})),k.Qb.indexOf(o)),k.Qb[a]),s=i.rows.map((e=>null==e.weight?{target:-1,weight:e.weight}:{target:e.target,weight:e.weight}));t.reference.weight=s.filter((e=>e.target===n))[0].weight,c({type:"setReference",logicalColor:e,value:t.reference.weight,hex:l.hex})}var a,r,o}),{reference:{lab:{l:0,a:0,b:0},weight:void 0},color:{apcaSurface1:0,apcaSurface2:0,apcaSurface3:0,apcaSurface4:0,wcagSurface1:0,wcagSurface2:0,wcagSurface3:0,wcagSurface4:0},colorHover:{apcaSurface1:0,apcaSurface2:0,apcaSurface3:0,apcaSurface4:0,wcagSurface1:0,wcagSurface2:0,wcagSurface3:0,wcagSurface4:0}}),[g,p]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{const t=new $.c(r?.settings.colors[e].hex);u({type:"labUpdate",value:t.lab,hex:t.toString({format:"hex"})})}),[r?.settings.colors[e].hex]),(0,d.createElement)(O,{title:A.TITLE+" "+A[t]+" "+A.MODE,icon:b.c,initialOpen:!1},(0,d.createElement)(L,null,(0,d.createElement)(m.ToggleControl,{label:"Hide A11Y checks",checked:g,onChange:()=>p(!g)}),(0,d.createElement)("h4",null,(0,w.cp)(e)),(0,d.createElement)(f,{logicalColor:e,action:`${"links"===e?"link":e}${l}`,color:`${"links"===e?"link":e}_${t}`}),(0,d.createElement)(_,{logicalColor:e}),!g&&(0,d.createElement)(y,{logical:e,mode:t,color:`${"links"===e?"link":e}_${t}`})),(0,d.createElement)(L,null,(0,d.createElement)("h4",null,(0,w.cp)(e)," Hover"),(0,d.createElement)(f,{logicalColor:e,action:`${"links"===e?"link":e}${l}Hover`,color:`${"links"===e?"link":e}_${t}_hover`}),(0,d.createElement)(_,{logicalColor:e}),!g&&(0,d.createElement)(y,{logical:e,mode:t,color:`${"links"===e?"link":e}_${t}_hover`})))},N=E.cp.div`
  && {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    h3 {
      color: var(--o-text-1);
    }
    button {
      max-width: 100%;
    }
  }
`,P=(0,E.cp)(N)`
  && {
    margin-top: var(--o-size-6);
  }
`,L=(0,E.cp)(P)`
  && {
    display: grid;
    grid-template-columns: 1fr;
    box-shadow: var(--o-shadow-1);
    width: 100%;
    & h4 {
      margin-top: auto;
      margin-bottom: auto;
    }
  }
`,O=(0,E.cp)(m.PanelBody)`
  && {
    border-top: none;
    border-bottom: none;
    color: var(--o-text-1);
    margin-top: var(--o-size-1) !important;
    & h2:hover {
      background: transparent !important;
    }
    & button.components-button {
      position: relative;
      color: var(--o-text-1);
      inline-size: 100%;
      max-width: initial !important;
      background: hsl(var(--o-links-hsl) / 5%);
      border-radius: var(--o-radius-2);
      &:hover {
        background: hsl(var(--o-links-hsl) / 15%);
      }
      & > svg {
        position: absolute;
        left: 180px;
        top: 50%;
        transform: translateY(-50%);
        transition: color 0.1s ease-in-out;
      }
      & svg {
        color: var(--o-text-1);
        fill: currentColor;
      }
    }
  }
`,M="leZOKhE6TL1GPAOP1X8P",I=({logicalColor:e,noTransparencies:t=!1})=>{const l=(0,a.useContext)(n.c),r=l?.settings.colors[e],[c,o]=(0,a.useState)("800");return(0,a.createElement)("div",{className:"QQ9N_FymVaDZ04z2AsfY"},v.WM.map((e=>(0,a.createElement)("div",{onMouseEnter:e=>{const t=e.target;o(t.innerText)},className:M,style:t?{backgroundColor:`hsl(${r.swatch[e]?.h+" "+r.swatch[e]?.s+" "+r.swatch[e]?.l})`}:{backgroundColor:`hsl(${r.swatch[e].h+" "+r.swatch[e]?.s+" "+r.swatch[e]?.l})`,cursor:"s-resize"}},(0,a.createElement)("span",null,e===r.weight?e+" ★":e)))),!t&&v.XW.map((e=>(0,a.createElement)("div",{className:M,style:{backgroundColor:`hsl(${r.swatch[c]?.h+" "+r.swatch[c]?.s+" "+r.swatch[c]?.l} / ${e}%)`}},e,"%"))))};var T=l(3490);(0,r.__)("Pick from the framework default palette or define a custom color by clicking on the color band.","oxyprops");const z=({logical:e})=>{const t=(0,w.cp)(e),l=(0,a.useContext)(n.c),c=(0,a.useContext)(s.c);return(0,d.createElement)(u.c,null,(0,d.createElement)("h3",null,t),(0,d.createElement)(D,null,(0,d.createElement)(W,{asButtons:!0,colors:v.ET,value:l?.settings?.colors[e]?.hex,onChange:e=>{((e,t)=>{const l=v.cp.filter((e=>e.color===t))[0]?.name?v.cp.filter((e=>e.color===t))[0]?.name:"custom";c({type:e,name:l,hex:t})})(`set${t}`,e)},clearable:!1})),(0,d.createElement)(G,null,(0,d.createElement)("p",null,(0,r.__)("The reference color is weight ","oxyprops")+l?.settings.colors[e].weight+" and is marked with a ⭐️."),(0,d.createElement)(I,{logicalColor:e})),(0,d.createElement)(B,{header:`${t} ${(0,r.__)("color schemes definition","oxyprops")}`},(0,d.createElement)(S,{logical:e,mode:"light"}),!l?.settings.theme.lock_mode&&l?.settings.theme.load_dark&&(0,d.createElement)(S,{logical:e,mode:"dark"}),!l?.settings.theme.lock_mode&&l?.settings.theme.load_dim&&(0,d.createElement)(S,{logical:e,mode:"dim"}),!l?.settings.theme.lock_mode&&l?.settings.theme.load_colorful_light&&(0,d.createElement)(S,{logical:e,mode:"colorful_light"}),!l?.settings.theme.lock_mode&&l?.settings.theme.load_colorful_dark&&(0,d.createElement)(S,{logical:e,mode:"colorful_dark"})),(0,d.createElement)(T.c,null))},D=E.cp.div`
  && {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    h3 {
      color: var(--o-text-1);
    }
    button {
      max-width: 100%;
    }
  }
`,W=(0,E.cp)(m.ColorPalette)`
  width: 100%;
`,G=(0,E.cp)(D)`
  && {
    margin-top: var(--o-size-6);
  }
`,B=(0,E.cp)(m.Panel)`
  && {
    background-color: transparent;
    margin-block: var(--_standard-spacing);
    border: none;
    padding-inline: 0;
    > * {
      padding-inline: 0;
      border: none;
    }
  }
`,U=({logical:e,mode:t,color:l})=>{const r=(0,a.useContext)(n.c),c=r?.settings.theme,o=c[l],s=c[`text1_${t}`],i=c[`text2_${t}`],h=c[`brand_${t}`],d=c[`brand_${t}_hover`],u=c[`accent_${t}`],g=c[`accent_${t}_hover`],p=c[`link_${t}`],E=c[`link_${t}_hover`],v=c[`visited_${t}`],f=c[`visited_${t}_hover`],x=r?.settings.colors.canvas.swatch,_=x[s],b=x[i],w=r?.settings.colors.brand.swatch,k=w[h],y=w[d],A=r?.settings.colors.accent.swatch;console.log(A);const S=A[u],N=A[g];console.log(S,N);const P=r?.settings.colors.links.swatch,L=P[p],O=P[E],M=r?.settings.colors.visited.swatch,I=M[v],T=M[f],z=x[o],D=new $.c("hsl",[_?.h,_?.s.replaceAll("%",""),_?.l.replaceAll("%","")]),W=new $.c("hsl",[b?.h,b?.s.replaceAll("%",""),b?.l.replaceAll("%","")]),G=new $.c("hsl",[k?.h,k?.s.replaceAll("%",""),k?.l.replaceAll("%","")]),B=new $.c("hsl",[y?.h,y?.s.replaceAll("%",""),y?.l.replaceAll("%","")]),U=new $.c("hsl",[S?.h,S?.s.replaceAll("%",""),S?.l.replaceAll("%","")]),Q=new $.c("hsl",[N?.h,N?.s.replaceAll("%",""),N?.l.replaceAll("%","")]),j=new $.c("hsl",[L?.h,L?.s.replaceAll("%",""),L?.l.replaceAll("%","")]),H=new $.c("hsl",[O?.h,O?.s.replaceAll("%",""),O?.l.replaceAll("%","")]),V=new $.c("hsl",[I?.h,I?.s.replaceAll("%",""),I?.l.replaceAll("%","")]),F=new $.c("hsl",[T?.h,T?.s.replaceAll("%",""),T?.l.replaceAll("%","")]),Y=new $.c("hsl",[z?.h,z?.s.replaceAll("%",""),z?.l.replaceAll("%","")]),R=Y?.contrastAPCA(D),K=Y?.contrastAPCA(W),X=Y?.contrastAPCA(G),Z=Y?.contrastAPCA(B),J=Y?.contrastAPCA(U),q=Y?.contrastAPCA(Q),ee=Y?.contrastAPCA(j),te=Y?.contrastAPCA(H),le=Y?.contrastAPCA(V),ae=Y?.contrastAPCA(F),re=Y?.contrastWCAG21(D),ce=Y?.contrastWCAG21(W),oe=Y?.contrastWCAG21(G),ne=Y?.contrastWCAG21(B),se=Y?.contrastWCAG21(U),ie=Y?.contrastWCAG21(Q),he=Y?.contrastWCAG21(j),de=Y?.contrastWCAG21(H),me=Y?.contrastWCAG21(V),ue=Y?.contrastWCAG21(F),ge=Math.round(10*(R+Number.EPSILON))/10,pe=Math.round(10*(K+Number.EPSILON))/10,Ee=Math.round(10*(X+Number.EPSILON))/10,$e=Math.round(10*(Z+Number.EPSILON))/10,ve=Math.round(10*(J+Number.EPSILON))/10,fe=Math.round(10*(q+Number.EPSILON))/10,xe=Math.round(10*(ee+Number.EPSILON))/10,_e=Math.round(10*(te+Number.EPSILON))/10,be=Math.round(10*(le+Number.EPSILON))/10,we=Math.round(10*(ae+Number.EPSILON))/10,ke=Math.round(10*(re+Number.EPSILON))/10,Ce=Math.round(10*(ce+Number.EPSILON))/10,ye=Math.round(10*(oe+Number.EPSILON))/10,Ae=Math.round(10*(ne+Number.EPSILON))/10,Se=Math.round(10*(se+Number.EPSILON))/10,Ne=Math.round(10*(ie+Number.EPSILON))/10,Pe=Math.round(10*(he+Number.EPSILON))/10,Le=Math.round(10*(de+Number.EPSILON))/10,Oe=Math.round(10*(me+Number.EPSILON))/10,Me=Math.round(10*(ue+Number.EPSILON))/10;return(0,a.createElement)(m.PanelRow,{className:""},(0,a.createElement)("table",{style:{inlineSize:"100%",captionSide:"bottom"}},(0,a.createElement)("caption",null,"Contrast Ratios"),(0,a.createElement)("thead",null,(0,a.createElement)("tr",null,(0,a.createElement)("th",{scope:"column"}),(0,a.createElement)("th",{scope:"column",className:C},"Text 1"),(0,a.createElement)("th",{scope:"column",className:C},"Text 2"),(0,a.createElement)("th",{scope:"column",className:C},"Brand"),(0,a.createElement)("th",{scope:"column",className:C},"B hover"),(0,a.createElement)("th",{scope:"column",className:C},"Accent"),(0,a.createElement)("th",{scope:"column",className:C},"A hover"),(0,a.createElement)("th",{scope:"column",className:C},"Link"),(0,a.createElement)("th",{scope:"column",className:C},"L hover"),(0,a.createElement)("th",{scope:"column",className:C},"Visited"),(0,a.createElement)("th",{scope:"column",className:C},"V hover"))),(0,a.createElement)("tbody",null,(0,a.createElement)("tr",null,(0,a.createElement)("th",{scope:"row"},"APCA"),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${_?.h}, ${_?.s}, ${_?.l})`,textAlign:"center"}},ge),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${b?.h}, ${b?.s}, ${b?.l})`,textAlign:"center"}},pe),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${k?.h}, ${k?.s}, ${k?.l})`,textAlign:"center"}},Ee),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${y?.h}, ${y?.s}, ${y?.l})`,textAlign:"center"}},$e),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${S?.h}, ${S?.s}, ${S?.l})`,textAlign:"center"}},ve),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${N?.h}, ${N?.s}, ${N?.l})`,textAlign:"center"}},fe),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${L?.h}, ${L?.s}, ${L?.l})`,textAlign:"center"}},xe),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${O?.h}, ${O?.s}, ${O?.l})`,textAlign:"center"}},_e),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${I?.h}, ${I?.s}, ${I?.l})`,textAlign:"center"}},be),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${T?.h}, ${T?.s}, ${T?.l})`,textAlign:"center"}},we)),(0,a.createElement)("tr",null,(0,a.createElement)("th",{scope:"row"},"WCAG 2.1"),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${_?.h}, ${_?.s}, ${_?.l})`,textAlign:"center"}},ke),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${b?.h}, ${b?.s}, ${b?.l})`,textAlign:"center"}},Ce),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${k?.h}, ${k?.s}, ${k?.l})`,textAlign:"center"}},ye),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${y?.h}, ${y?.s}, ${y?.l})`,textAlign:"center"}},Ae),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${S?.h}, ${S?.s}, ${S?.l})`,textAlign:"center"}},Se),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${N?.h}, ${N?.s}, ${N?.l})`,textAlign:"center"}},Ne),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${L?.h}, ${L?.s}, ${L?.l})`,textAlign:"center"}},Pe),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${O?.h}, ${O?.s}, ${O?.l})`,textAlign:"center"}},Le),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${I?.h}, ${I?.s}, ${I?.l})`,textAlign:"center"}},Oe),(0,a.createElement)("td",{style:{background:`hsl(${z?.h}, ${z?.s}, ${z?.l})`,color:`hsl(${T?.h}, ${T?.s}, ${T?.l})`,textAlign:"center"}},Me)))))},Q={TITLE:(0,r.__)("Details of your","oxyprops"),light:(0,r.__)("Light","oxyprops"),dark:(0,r.__)("Dark","oxyprops"),dim:(0,r.__)("dim (reduced contrast) mode","oxyprops"),colorful_light:(0,r.__)("colorful light mode (brand replaces canvas)","oxyprops"),colorful_dark:(0,r.__)("colorful dark mode (brand replaces canvas)","oxyprops"),MODE:(0,r.__)("mode","oxyprops")},j=({mode:e})=>{const t=(0,a.useContext)(n.c),l=(0,a.useContext)(s.c),c=(0,w.cp)((0,w.g5)(e)),i=(0,k.M7)(),[h,u]=(0,o.E)(((e,t)=>{if("labUpdate"===t.type){e.reference.lab.l=t.value.l,e.reference.lab.a=t.value.a,e.reference.lab.b=t.value.b;let o=(a=(r=t.value.l,c=k.Qb.reduce((function(e,t){return Math.abs(t-r)<Math.abs(e-r)?t:e})),k.Qb.indexOf(c)),k.Qb[a]),n=i.rows.map((e=>null==e.weight?{target:-1,weight:e.weight}:{target:e.target,weight:e.weight}));e.reference.weight=n.filter((e=>e.target===o))[0].weight,l({type:"setReference",logicalColor:"canvas",value:e.reference.weight,hex:t.hex})}var a,r,c}),{reference:{lab:{l:0,a:0,b:0},weight:void 0},color:{apcaSurface1:0,apcaSurface2:0,apcaSurface3:0,apcaSurface4:0,wcagSurface1:0,wcagSurface2:0,wcagSurface3:0,wcagSurface4:0},colorHover:{apcaSurface1:0,apcaSurface2:0,apcaSurface3:0,apcaSurface4:0,wcagSurface1:0,wcagSurface2:0,wcagSurface3:0,wcagSurface4:0}}),[g,p]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{const e=new $.c(t?.settings.colors.canvas.hex);u({type:"labUpdate",value:e.lab,hex:e.toString({format:"hex"})})}),[t?.settings.colors.canvas.hex]),(0,d.createElement)(R,{title:Q.TITLE+" "+Q[e]+" "+Q.MODE,icon:b.c,initialOpen:!1},(0,d.createElement)(F,null,(0,d.createElement)(m.ToggleControl,{label:"Hide A11Y checks",checked:g,onChange:()=>p(!g)}),(0,d.createElement)("h4",null,"Surface 1"),(0,d.createElement)(f,{logicalColor:"canvas",action:`surface1${c}`,color:`surface1_${e}`}),(0,d.createElement)(_,{logicalColor:"canvas"}),!g&&(0,d.createElement)(U,{logical:"canvas",mode:e,color:`surface1_${e}`})),(0,d.createElement)(F,null,(0,d.createElement)("h4",null,"Surface 2"),(0,d.createElement)(f,{logicalColor:"canvas",action:`surface2${c}`,color:`surface2_${e}`}),(0,d.createElement)(_,{logicalColor:"canvas"}),!g&&(0,d.createElement)(U,{logical:"canvas",mode:e,color:`surface2_${e}`})),(0,d.createElement)(F,null,(0,d.createElement)("h4",null,"Surface 3"),(0,d.createElement)(f,{logicalColor:"canvas",action:`surface3${c}`,color:`surface3_${e}`}),(0,d.createElement)(_,{logicalColor:"canvas"}),!g&&(0,d.createElement)(U,{logical:"canvas",mode:e,color:`surface3_${e}`})),(0,d.createElement)(F,null,(0,d.createElement)("h4",null,"Surface 4"),(0,d.createElement)(f,{logicalColor:"canvas",action:`surface4${c}`,color:`surface4_${e}`}),(0,d.createElement)(_,{logicalColor:"canvas"}),!g&&(0,d.createElement)(U,{logical:"canvas",mode:e,color:`surface4_${e}`})),(0,d.createElement)(F,null,(0,d.createElement)("h4",null,"Text 1"),(0,d.createElement)(f,{logicalColor:"canvas",action:`text1${c}`,color:`text1_${e}`}),(0,d.createElement)(_,{logicalColor:"canvas"}),!g&&(0,d.createElement)(y,{logical:"canvas",mode:e,color:`text1_${e}`})),(0,d.createElement)(F,null,(0,d.createElement)("h4",null,"Text 2"),(0,d.createElement)(f,{logicalColor:"canvas",action:`text2${c}`,color:`text2_${e}`}),(0,d.createElement)(_,{logicalColor:"canvas"}),!g&&(0,d.createElement)(y,{logical:"canvas",mode:e,color:`text2_${e}`})),(0,d.createElement)(F,null,(0,d.createElement)("h4",null,"Scrollbars"),(0,d.createElement)(f,{logicalColor:"canvas",action:`scrollbar${c}`,color:`scrollbar_${e}`}),(0,d.createElement)(_,{logicalColor:"canvas"})),(0,d.createElement)(F,null,(0,d.createElement)("h4",null,"Shadows"),(0,d.createElement)(f,{logicalColor:"canvas",action:`shadowColor${c}`,color:`shadow_color_${e}`}),(0,d.createElement)(_,{logicalColor:"canvas"}),(0,d.createElement)(Y,{onChange:e=>{l({type:`shadowStrength${c}`,value:e})},help:(0,r.__)("Define your shadow strength from 0 to 100%","oxyprops")+".",currentInput:parseInt(t?.settings?.theme[`shadow_strength_${e}`]),initialPosition:parseInt(t?.settings?.theme[`shadow_strength_${e}`]),color:"var(--o-brand)",trackColor:"var(--o-links)",railColor:"var(--o-surface-4)",min:0,max:100,step:1})))},H=E.cp.div`
  && {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    h3 {
      color: var(--o-text-1);
    }
    button {
      max-width: 100%;
    }
  }
`,V=(0,E.cp)(H)`
  && {
    margin-top: var(--o-size-6);
  }
`,F=(0,E.cp)(V)`
  && {
    display: grid;
    grid-template-columns: 1fr;
    box-shadow: var(--o-shadow-1);
    width: 100%;
    & h4 {
      margin-top: auto;
      margin-bottom: auto;
    }
  }
`,Y=(0,E.cp)(m.RangeControl)`
  && {
    width: 50%;
    min-width: 300px;
    margin-top: var(--_standard-spacing);
    & input {
      color: var(--o-text-1) !important;
      background: var(--o-surface-2) !important;
    }
  }
`,R=(0,E.cp)(m.PanelBody)`
  && {
    border-top: none;
    border-bottom: none;
    color: var(--o-text-1);
    margin-top: var(--o-size-1) !important;
    & h2:hover {
      background: transparent !important;
    }
    & button.components-button {
      position: relative;
      color: var(--o-text-1);
      inline-size: 100%;
      max-width: initial !important;
      background: hsl(var(--o-links-hsl) / 5%);
      border-radius: var(--o-radius-2);
      &:hover {
        background: hsl(var(--o-links-hsl) / 15%);
      }
      & > svg {
        position: absolute;
        left: 180px;
        top: 50%;
        transform: translateY(-50%);
        transition: color 0.1s ease-in-out;
      }
      & svg {
        color: var(--o-text-1);
        fill: currentColor;
      }
    }
  }
`,K=((0,r.__)("Pick from the framework default palette or define a custom color by clicking on the color band.","oxyprops"),({logical:e})=>{const t=(0,w.cp)(e),l=(0,a.useContext)(n.c),c=(0,a.useContext)(s.c);return(0,d.createElement)(u.c,null,(0,d.createElement)("h3",null,t),(0,d.createElement)(X,null,(0,d.createElement)(Z,{asButtons:!0,style:{marginBottom:"calc(28px + 12px)"},colors:v.Cm,value:l?.settings.colors.canvas.hex,onChange:e=>{((e,t)=>{const l=v.cp.filter((e=>e.color===t))[0]?.name?v.cp.filter((e=>e.color===t))[0]?.name:"custom";c({type:e,name:l,hex:t})})(`set${t}`,e)},clearable:!1})),(0,d.createElement)(J,null,(0,d.createElement)("p",null,(0,r.__)("The reference color is weight ","oxyprops")+l?.settings.colors[e].weight+" and is marked with a ⭐️."),(0,d.createElement)(I,{logicalColor:e})),(0,d.createElement)(q,{header:`${t} ${(0,r.__)("color schemes definition","oxyprops")}`},(0,d.createElement)(j,{mode:"light"}),!l?.settings.theme.lock_mode&&l?.settings.theme.load_dark&&(0,d.createElement)(j,{mode:"dark"}),!l?.settings.theme.lock_mode&&l?.settings.theme.load_dim&&(0,d.createElement)(j,{mode:"dim"}),!l?.settings.theme.lock_mode&&l?.settings.theme.load_colorful_light&&(0,d.createElement)(j,{mode:"colorful_light"}),!l?.settings.theme.lock_mode&&l?.settings.theme.load_colorful_dark&&(0,d.createElement)(j,{mode:"colorful_dark"})),(0,d.createElement)(T.c,null))}),X=E.cp.div`
  && {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    h3 {
      color: var(--o-text-1);
    }
    button {
      max-width: 100%;
    }
  }
`,Z=(0,E.cp)(m.ColorPalette)`
  width: 100%;
`,J=(0,E.cp)(X)`
  && {
    margin-top: var(--o-size-6);
  }
`,q=(0,E.cp)(m.Panel)`
  && {
    background-color: transparent;
    margin-block: var(--_standard-spacing);
    border: none;
    padding-inline: 0;
    > * {
      padding-inline: 0;
      border: none;
    }
  }
`;var ee=l(756),te=l(356);const le=()=>{const e=(0,a.useContext)(n.c),t=(0,a.useContext)(s.c),l=(0,c.i6)(),[d,m]=(0,o.E)(((e,t)=>{switch(t.type){case"shadeCanvas":e.isSelectedCanvasShade=t.value;break;case"shadeBrand":e.isSelectedBrandShade=t.value;break;case"shadeAccent":e.isSelectedAccentShade=t.value;break;case"shadeLinks":e.isSelectedLinksShade=t.value;break;case"shadeVisited":e.isSelectedVisitedShade=t.value}}),{isSelectedCanvasShade:"800",isSelectedBrandShade:"800",isSelectedAccentShade:"800",isSelectedLinksShade:"800",isSelectedVisitedShade:"800"});return(0,a.useEffect)((()=>{e?.isFetching||e?.licenseStatus.is_valid||(t({type:"flashMessage",value:(0,r.__)("You must activate your license before accessing this page.","oxyprops"),color:"danger"}),l("/"))}),[e?.isFetching]),e?.isFetching?(0,a.createElement)("div",{className:"oxyprops-loader-container"},(0,a.createElement)(h.c,null)):(0,a.createElement)(i.c,{title:(0,r.__)("Colors","oxyprops")},(0,a.createElement)(ee.c,{title:(0,r.__)("Color Schemes","oxyprops")},(0,a.createElement)(te.c,{type:"flexCards2"},(0,a.createElement)(p,null)),(0,a.createElement)(T.c,null)),(0,a.createElement)(ee.c,{title:(0,r.__)("Logical Colors","oxyprops")},(0,a.createElement)(te.c,{type:"flexCards2"},(0,a.createElement)(K,{logical:"canvas"}),["brand","accent","links","visited"].map((e=>(0,a.createElement)(z,{key:e,logical:e}))))))}},8064:(e,t,l)=>{l.d(t,{c:()=>c});var a=l(1280),r=l(5992);const c=({tag:e="div",type:t="inner",invert:l=!1,children:r})=>"outer"===t?(0,a.createElement)(n,{className:l?"o-invert":""},r):(0,a.createElement)(o,{className:l?"o-invert":""},r),o=r.cp.div`
  && {
    background-color: var(--o-surface-1);
    max-inline-size: var(--_container-max-width, 82rem);
    margin-inline: auto;
    padding-block: var(--_standard-spacing);
  }
`,n=r.cp.section`
  && {
    background-color: var(--o-surface-1);
    margin: 0;
    max-inline-size: 100%;
  }
`;r.cp.h2`
  && {
    color: var(--o-text-1);
    font-size: var(--_h2-font-size);
    line-height: var(--_h2-lineheight);
    margin-block-end: var(--_standard-spacing);
  }
`,r.cp.p`
  && {
    color: var(--o-text-2);
    font-size: var(--_p-font-size);
    line-height: var(--_p-lineheight);
  }
`},356:(e,t,l)=>{l.d(t,{c:()=>c});var a=l(1280),r=l(5992);const c=({type:e,children:t})=>{switch(e){case"leftSidebar":return(0,a.createElement)(d,null,t);case"flexCards2":return(0,a.createElement)(n,null,t);case"flexCards3":return(0,a.createElement)(s,null,t);case"flexCards4":return(0,a.createElement)(i,null,t);case"flexCards3Stretch":return(0,a.createElement)(h,null,t);default:return(0,a.createElement)(o,null,t)}},o=r.cp.div`
  && {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: initial;
    width: 100%;
    gap: var(--_standard-spacing);

    & > * {
      flex: 0 1 50ch;
    }
  }
`,n=r.cp.div`
  && {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: initial;
    width: 100%;
    gap: var(--_standard-spacing);
    --_child-width: calc(
      (var(--_container-max-width) - var(--_standard-spacing)) / 2
    );

    & > * {
      flex: 0 1 var(--_child-width);
    }
  }
`,s=r.cp.div`
  && {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: initial;
    width: 100%;
    gap: var(--_standard-spacing);
    --_child-width: calc(
      (var(--_container-max-width) - var(--_standard-spacing) * 2) / 3
    );

    & > * {
      flex: 0 1 var(--_child-width);
    }
  }
`,i=r.cp.div`
  && {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: initial;
    width: 100%;
    gap: var(--_standard-spacing);
    --_child-width: calc(
      (var(--_container-max-width) - var(--_standard-spacing) * 3) / 4
    );

    & > * {
      flex: 0 1 var(--_child-width);
    }
  }
`,h=r.cp.div`
  && {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: initial;
    width: 100%;
    gap: var(--_standard-spacing);
    --_child-width: calc(
      (var(--_container-max-width) - var(--_standard-spacing) * 2) / 3
    );

    & > * {
      flex: 1 1 var(--_child-width);
    }
  }
`,d=r.cp.div`
  && {
    display: flex;
    flex-direction: column;
    gap: var(--_standard-spacing);
    @media (min-width: 1440px) {
      display: grid;
      grid-template-columns:
        minmax(30ch, 25%)
        1fr;
      align-items: stretch;
    }
  }
`},812:(e,t,l)=>{l.d(t,{c:()=>r});var a=l(8496);const r=()=>(0,a.createElement)("div",{className:"dots-loading"},(0,a.createElement)("div",null))},9668:(e,t,l)=>{l.d(t,{c:()=>c});var a=l(8496),r=l(8064);const c=({title:e,children:t})=>((0,a.useEffect)((()=>{document.title=`${e} » OxyProps`,window.scrollTo(0,0)}),[e]),(0,a.createElement)(r.c,{type:"outer",tag:"main"},t))},3490:(e,t,l)=>{l.d(t,{c:()=>m});var a=l(1280),r=l(5992),c=l(3396),o=l(8496),n=l(7287),s=l(8008);const i=(0,a.createElement)(s.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,a.createElement)(s.Path,{d:"m11.3 17.2-5-5c-.1-.1-.1-.3 0-.4l2.3-2.3-1.1-1-2.3 2.3c-.7.7-.7 1.8 0 2.5l5 5H7.5v1.5h5.3v-5.2h-1.5v2.6zm7.5-6.4-5-5h2.7V4.2h-5.2v5.2h1.5V6.8l5 5c.1.1.1.3 0 .4l-2.3 2.3 1.1 1.1 2.3-2.3c.6-.7.6-1.9-.1-2.5z"}));var h=l(4639),d=l(2636);const m=()=>{var e,t,l;const r=(0,o.useContext)(h.c),s=(0,o.useContext)(d.c);return(0,a.createElement)(u,{className:null!==(e=r?.countUpdateSettings)&&void 0!==e&&e?"active":"",variant:null!==(t=r?.countUpdateSettings)&&void 0!==t&&t?"primary":"secondary",onClick:()=>{s({type:"save"})},disabled:r?.isSaving,icon:i,__next40pxDefaultSize:!0},r?.isSaving&&(0,a.createElement)(o.Fragment,null,(0,a.createElement)(n.Spinner,null)," ",(0,c.__)("Updating Settings")),!r?.isSaving&&(null!==(l=r?.countUpdateSettings)&&void 0!==l?l:0)<1?(0,c.__)("Update Settings"):(0,c.__)("Changes Detected - Update Settings"))},u=(0,r.cp)(n.Button)`
  && {
    margin-top: var(--o-size-4);
    width: max-content;

    &.active {
      animation: var(--o-animation-shake-x);
      // animation-duration: 2s;
    }
  }
`},756:(e,t,l)=>{l.d(t,{c:()=>o});var a=l(1280),r=l(5992),c=l(8064);const o=({title:e,invert:t,children:l})=>(0,a.createElement)(c.c,{type:"outer",tag:"section",invert:t},(0,a.createElement)(c.c,{type:"inner",tag:"div"},e&&(0,a.createElement)(n,null,e),l)),n=r.cp.h2`
  color: var(--o-text-1);
  font-size: var(--_h2-font-size);
  line-height: var(--_h2-lineheight);
  margin-block-end: var(--_standard-spacing);
`},7116:(e,t,l)=>{l.d(t,{cp:()=>r,g5:()=>a}),l(3768);const a=e=>e.replace(/([-_][a-z])/gi,(e=>e.toUpperCase().replace("-","").replace("_",""))),r=e=>"string"!=typeof e||0===e.length?"":"text-basic"===e?"Basic Text":"omenubar"===e?"Menu Bar":"oicon"===e?"OP Icon":"bricksprops-light-dark-toggle"===e?"Light/Dark":"oschemesswitcher"===e?"All Schemes":e.charAt(0).toUpperCase()+e.slice(1)}}]);