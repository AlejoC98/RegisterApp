"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[225],{3225:function(n,t,e){e.r(t),e.d(t,{default:function(){return on}});var i=e(1413),r=e(9439),o=e(8007),a=e(4554),s=e(890),l=e(1889),d=e(6989),c=e(6151),u=e(5705),h=e(2791),g=e(5250),v=e(3953),f=e(7070),m=e(4942),Z=e(6786),x=e(2610),p=e(184),b=function(n){var t=n.id,e=n.label,o=n.handleBlur,l=n.error,c=n.helperText,u=n.value,v=n.onChange,f=n.name,b=n.setValues,S=n.disabled,P=(0,h.useState)(u),I=(0,r.Z)(P,2),k=I[0],y=I[1],j=(0,h.useState)([]),w=(0,r.Z)(j,2),L=w[0],C=w[1];return(0,h.useEffect)((function(){var n=["Outlined","Filled","Sharp","TwoTone"],t=[];Object.keys(x).forEach((function(e){n.some((function(n){return e.includes(n)||-1===e.indexOf("Rounded")}))||t.push(e)})),C(t)}),[]),(0,p.jsx)(Z.Z,{fullWidth:!0,disablePortal:!0,id:t,options:L,renderOption:function(n,t){return(0,p.jsxs)(a.Z,(0,i.Z)((0,i.Z)({},n),{},{display:"flex",width:"100%",justifyContent:"space-around",children:[(0,p.jsx)(s.Z,{children:t}),(0,g.ky)(t)]}))},renderInput:function(n){return(0,p.jsx)(d.Z,(0,i.Z)((0,i.Z)({},n),{},{label:e,onBlur:o,onChange:v,error:l,helperText:c,value:k,name:f,disabled:S}))},onChange:function(n,t){y(n.currentTarget.textContent),b((function(n){return(0,i.Z)((0,i.Z)({},n),{},(0,m.Z)({},f,t))}))}})},S=e(1243),P=e(5985),I=e(3366),k=e(7462),y=e(4036),j=e(7384),w=e(4419),L=e(6934),C=e(1402),T=e(168),M=e(8182),R=e(2554),B=e(5878),W=e(1217);function E(n){return(0,W.Z)("MuiCircularProgress",n)}(0,B.Z)("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);var D,q,z,N,F,V,O,U,_=["className","color","disableShrink","size","style","thickness","value","variant"],A=44,G=(0,R.F4)(F||(F=D||(D=(0,T.Z)(["\n  0% {\n    transform: rotate(0deg);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n"])))),J=(0,R.F4)(V||(V=q||(q=(0,T.Z)(["\n  0% {\n    stroke-dasharray: 1px, 200px;\n    stroke-dashoffset: 0;\n  }\n\n  50% {\n    stroke-dasharray: 100px, 200px;\n    stroke-dashoffset: -15px;\n  }\n\n  100% {\n    stroke-dasharray: 100px, 200px;\n    stroke-dashoffset: -125px;\n  }\n"])))),X=(0,L.ZP)("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:function(n,t){var e=n.ownerState;return[t.root,t[e.variant],t["color".concat((0,y.Z)(e.color))]]}})((function(n){var t=n.ownerState,e=n.theme;return(0,k.Z)({display:"inline-block"},"determinate"===t.variant&&{transition:e.transitions.create("transform")},"inherit"!==t.color&&{color:(e.vars||e).palette[t.color].main})}),(function(n){return"indeterminate"===n.ownerState.variant&&(0,R.iv)(O||(O=z||(z=(0,T.Z)(["\n      animation: "," 1.4s linear infinite;\n    "]))),G)})),H=(0,L.ZP)("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:function(n,t){return t.svg}})({display:"block"}),K=(0,L.ZP)("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:function(n,t){var e=n.ownerState;return[t.circle,t["circle".concat((0,y.Z)(e.variant))],e.disableShrink&&t.circleDisableShrink]}})((function(n){var t=n.ownerState,e=n.theme;return(0,k.Z)({stroke:"currentColor"},"determinate"===t.variant&&{transition:e.transitions.create("stroke-dashoffset")},"indeterminate"===t.variant&&{strokeDasharray:"80px, 200px",strokeDashoffset:0})}),(function(n){var t=n.ownerState;return"indeterminate"===t.variant&&!t.disableShrink&&(0,R.iv)(U||(U=N||(N=(0,T.Z)(["\n      animation: "," 1.4s ease-in-out infinite;\n    "]))),J)})),Q=h.forwardRef((function(n,t){var e=(0,C.Z)({props:n,name:"MuiCircularProgress"}),i=e.className,r=e.color,o=void 0===r?"primary":r,a=e.disableShrink,s=void 0!==a&&a,l=e.size,d=void 0===l?40:l,c=e.style,u=e.thickness,h=void 0===u?3.6:u,g=e.value,v=void 0===g?0:g,f=e.variant,m=void 0===f?"indeterminate":f,Z=(0,I.Z)(e,_),x=(0,k.Z)({},e,{color:o,disableShrink:s,size:d,thickness:h,value:v,variant:m}),b=function(n){var t=n.classes,e=n.variant,i=n.color,r=n.disableShrink,o={root:["root",e,"color".concat((0,y.Z)(i))],svg:["svg"],circle:["circle","circle".concat((0,y.Z)(e)),r&&"circleDisableShrink"]};return(0,w.Z)(o,E,t)}(x),S={},P={},j={};if("determinate"===m){var L=2*Math.PI*((A-h)/2);S.strokeDasharray=L.toFixed(3),j["aria-valuenow"]=Math.round(v),S.strokeDashoffset="".concat(((100-v)/100*L).toFixed(3),"px"),P.transform="rotate(-90deg)"}return(0,p.jsx)(X,(0,k.Z)({className:(0,M.Z)(b.root,i),style:(0,k.Z)({width:d,height:d},P,c),ownerState:x,ref:t,role:"progressbar"},j,Z,{children:(0,p.jsx)(H,{className:b.svg,ownerState:x,viewBox:"".concat(22," ").concat(22," ").concat(A," ").concat(A),children:(0,p.jsx)(K,{className:b.circle,style:S,ownerState:x,cx:A,cy:A,r:(A-h)/2,fill:"none",strokeWidth:h})})}))}));function Y(n){return(0,W.Z)("MuiLoadingButton",n)}var $=(0,B.Z)("MuiLoadingButton",["root","loading","loadingIndicator","loadingIndicatorCenter","loadingIndicatorStart","loadingIndicatorEnd","endIconLoadingEnd","startIconLoadingStart"]),nn=["children","disabled","id","loading","loadingIndicator","loadingPosition","variant"],tn=(0,L.ZP)(c.Z,{shouldForwardProp:function(n){return function(n){return"ownerState"!==n&&"theme"!==n&&"sx"!==n&&"as"!==n&&"classes"!==n}(n)||"classes"===n},name:"MuiLoadingButton",slot:"Root",overridesResolver:function(n,t){return[t.root,t.startIconLoadingStart&&(0,m.Z)({},"& .".concat($.startIconLoadingStart),t.startIconLoadingStart),t.endIconLoadingEnd&&(0,m.Z)({},"& .".concat($.endIconLoadingEnd),t.endIconLoadingEnd)]}})((function(n){var t=n.ownerState,e=n.theme;return(0,k.Z)((0,m.Z)({},"& .".concat($.startIconLoadingStart,", & .").concat($.endIconLoadingEnd),{transition:e.transitions.create(["opacity"],{duration:e.transitions.duration.short}),opacity:0}),"center"===t.loadingPosition&&(0,m.Z)({transition:e.transitions.create(["background-color","box-shadow","border-color"],{duration:e.transitions.duration.short})},"&.".concat($.loading),{color:"transparent"}),"start"===t.loadingPosition&&t.fullWidth&&(0,m.Z)({},"& .".concat($.startIconLoadingStart,", & .").concat($.endIconLoadingEnd),{transition:e.transitions.create(["opacity"],{duration:e.transitions.duration.short}),opacity:0,marginRight:-8}),"end"===t.loadingPosition&&t.fullWidth&&(0,m.Z)({},"& .".concat($.startIconLoadingStart,", & .").concat($.endIconLoadingEnd),{transition:e.transitions.create(["opacity"],{duration:e.transitions.duration.short}),opacity:0,marginLeft:-8}))})),en=(0,L.ZP)("div",{name:"MuiLoadingButton",slot:"LoadingIndicator",overridesResolver:function(n,t){var e=n.ownerState;return[t.loadingIndicator,t["loadingIndicator".concat((0,y.Z)(e.loadingPosition))]]}})((function(n){var t=n.theme,e=n.ownerState;return(0,k.Z)({position:"absolute",visibility:"visible",display:"flex"},"start"===e.loadingPosition&&("outlined"===e.variant||"contained"===e.variant)&&{left:"small"===e.size?10:14},"start"===e.loadingPosition&&"text"===e.variant&&{left:6},"center"===e.loadingPosition&&{left:"50%",transform:"translate(-50%)",color:(t.vars||t).palette.action.disabled},"end"===e.loadingPosition&&("outlined"===e.variant||"contained"===e.variant)&&{right:"small"===e.size?10:14},"end"===e.loadingPosition&&"text"===e.variant&&{right:6},"start"===e.loadingPosition&&e.fullWidth&&{position:"relative",left:-10},"end"===e.loadingPosition&&e.fullWidth&&{position:"relative",right:-10})})),rn=h.forwardRef((function(n,t){var e=(0,C.Z)({props:n,name:"MuiLoadingButton"}),i=e.children,r=e.disabled,o=void 0!==r&&r,a=e.id,s=e.loading,l=void 0!==s&&s,d=e.loadingIndicator,c=e.loadingPosition,u=void 0===c?"center":c,h=e.variant,g=void 0===h?"text":h,v=(0,I.Z)(e,nn),f=(0,j.Z)(a),m=null!=d?d:(0,p.jsx)(Q,{"aria-labelledby":f,color:"inherit",size:16}),Z=(0,k.Z)({},e,{disabled:o,loading:l,loadingIndicator:m,loadingPosition:u,variant:g}),x=function(n){var t=n.loading,e=n.loadingPosition,i=n.classes,r={root:["root",t&&"loading"],startIcon:[t&&"startIconLoading".concat((0,y.Z)(e))],endIcon:[t&&"endIconLoading".concat((0,y.Z)(e))],loadingIndicator:["loadingIndicator",t&&"loadingIndicator".concat((0,y.Z)(e))]},o=(0,w.Z)(r,Y,i);return(0,k.Z)({},i,o)}(Z),b=l?(0,p.jsx)(en,{className:x.loadingIndicator,ownerState:Z,children:m}):null;return(0,p.jsxs)(tn,(0,k.Z)({disabled:o||l,id:f,ref:t},v,{variant:g,classes:x,ownerState:Z,children:["end"===Z.loadingPosition?i:b,"end"===Z.loadingPosition?b:i]}))})),on=function(){var n=(0,v.xB)(),t=n.roles,e=n.updateList,m=(0,g.Tb)(t),Z=(0,h.useState)(!1),x=(0,r.Z)(Z,2),I=x[0],k=x[1],y=o.Ry().shape({name:o.Z_().required("This field is required!"),icon:o.Z_().required("This field is required!"),to:o.Z_().required("This field is required!"),role:o.IX().required("This field is required!")});return(0,p.jsxs)(a.Z,{flexGrow:1,pt:5,children:[(0,p.jsx)(s.Z,{variant:"h4",children:"New Menu"}),(0,p.jsx)(u.J9,{onSubmit:function(n,t){var i=t.resetForm;k(!0),S.Z.post("/createData",{collection:"menus",values:n}).then((function(t){!0===t.data.status&&(e("roles",n),i(),k(!1),P.Am.success(t.data.message)),console.log(t.data)})).catch((function(n){k(!1),P.Am.error(n)}))},initialValues:{name:"",icon:"",to:"/",role:[]},validationSchema:y,children:function(n){var t=n.values,e=n.errors,r=n.touched,o=n.handleChange,s=n.handleSubmit,u=n.handleBlur,h=n.setValues;return(0,p.jsx)("form",{onSubmit:s,children:(0,p.jsx)(a.Z,{flexGrow:1,mt:5,mb:5,pl:15,pr:15,children:(0,p.jsxs)(l.ZP,{container:!0,spacing:2,children:[(0,p.jsx)(l.ZP,{item:!0,md:6,sm:12,children:(0,p.jsx)(g.sU,{children:(0,p.jsx)(d.Z,{fullWidth:!0,label:"Name",variant:"outlined",type:"text",name:"name",value:t.name,disabled:I,onChange:o,error:!!r.name&&!!e.name,helperText:r.name&&e.name})})}),(0,p.jsx)(l.ZP,{item:!0,md:6,sm:12,children:(0,p.jsx)(g.sU,{children:(0,p.jsx)(b,{id:"search-icons",label:"Icon",onBlur:u,onChange:o,value:t.icon,name:"icon",setValues:h,disabled:I,error:!!r.icon&&!!e.icon,helperText:r.icon&&e.icon})})}),(0,p.jsx)(l.ZP,{item:!0,md:6,sm:12,children:(0,p.jsx)(g.sU,{children:(0,p.jsx)(d.Z,{fullWidth:!0,label:"Link To",variant:"outlined",type:"text",name:"to",onChange:function(n){o(n),function(n,t){n.target.value.startsWith("/")||t((function(t){return(0,i.Z)((0,i.Z)({},t),{},{to:"/".concat(n.target.value)})}))}(n,h)},value:t.to,disabled:I,error:!!r.to&&!!e.to,helperText:r.to&&e.to})})}),(0,p.jsx)(l.ZP,{item:!0,md:6,sm:12,children:(0,p.jsx)(g.sU,{children:(0,p.jsx)(f.Z,{fullWidth:!0,options:m,multiple:!0,setValues:h,label:"Role",variant:"outlined",type:"text",name:"role",onChange:o,value:t.role,disabled:I,error:!!r.role&&!!e.role,helperText:r.role&&e.role})})}),(0,p.jsx)(l.ZP,{item:!0,md:12,sx:{mt:3},children:I?(0,p.jsx)(rn,{size:"medium",fullWidth:!0,loading:!0,variant:"outlined",children:"Creating..."}):(0,p.jsx)(c.Z,{variant:"outlined",size:"large",color:"primary",type:"submit",children:"Create"})})]})})})}})]})}}}]);
//# sourceMappingURL=225.a0cd14fa.chunk.js.map