(()=>{var e={};e.id=187,e.ids=[187,888,660],e.modules={7259:(e,t,r)=>{"use strict";r.r(t),r.d(t,{config:()=>m,default:()=>l,getServerSideProps:()=>c,getStaticPaths:()=>g,getStaticProps:()=>u,reportWebVitals:()=>S,routeModule:()=>_,unstable_getServerProps:()=>x,unstable_getServerSideProps:()=>$,unstable_getStaticParams:()=>P,unstable_getStaticPaths:()=>h,unstable_getStaticProps:()=>v});var s=r(7093),n=r(5244),a=r(1323),i=r(9209),o=r.n(i),p=r(9597),d=r(4266);let l=(0,a.l)(d,"default"),u=(0,a.l)(d,"getStaticProps"),g=(0,a.l)(d,"getStaticPaths"),c=(0,a.l)(d,"getServerSideProps"),m=(0,a.l)(d,"config"),S=(0,a.l)(d,"reportWebVitals"),v=(0,a.l)(d,"unstable_getStaticProps"),h=(0,a.l)(d,"unstable_getStaticPaths"),P=(0,a.l)(d,"unstable_getStaticParams"),x=(0,a.l)(d,"unstable_getServerProps"),$=(0,a.l)(d,"unstable_getServerSideProps"),_=new s.PagesRouteModule({definition:{kind:n.x.PAGES,page:"/confirmation",pathname:"/confirmation",bundlePath:"",filename:""},components:{App:p.default,Document:o()},userland:d})},9597:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>MyApp});var s=r(997);r(4195),r(7109),r(3162),r(2533),r(9317),r(9398);var n=r(1649);function MyApp({Component:e,pageProps:{session:t,...r}}){return s.jsx(n.SessionProvider,{session:t,children:s.jsx(e,{...r})})}},4266:()=>{document.addEventListener("DOMContentLoaded",()=>{console.log("Order confirmation page loaded");let e=sessionStorage.getItem("lastOrderId");if(!e){window.location.href="/";return}let t=OrderManager.getOrderById(e);if(!t){window.location.href="/";return}let r=new Date(t.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),s=document.getElementById("order-info");s.innerHTML=`
    <p><strong>Order ID:</strong> ${t.id}</p>
    <p><strong>Date:</strong> ${r}</p>
    <p><strong>Status:</strong> ${t.status}</p>
  `;let n=document.getElementById("shipping-address");n.innerHTML=`
    <p>${t.shipping.fullName}</p>
    <p>${t.shipping.address}</p>
    <p>${t.shipping.city}, ${t.shipping.state} ${t.shipping.zip}</p>
    <p>${t.shipping.country}</p>
    <p>Phone: ${t.shipping.phone}</p>
  `;let a=document.getElementById("order-summary"),i="<div>";t.items.forEach(e=>{i+=`
      <div>
        <span>${e.product.name} \xd7 ${e.quantity}</span>
        <span>$${(e.product.price*e.quantity).toFixed(2)}</span>
      </div>
    `});let o=.08*t.total;i+=`
    <div>
      <span>Subtotal:</span>
      <span>$${t.total.toFixed(2)}</span>
    </div>
    <div>
      <span>Shipping:</span>
      <span>Free</span>
    </div>
    <div>
      <span>Tax:</span>
      <span>$${o.toFixed(2)}</span>
    </div>
    <div>
      <strong>Total:</strong>
      <strong>$${(t.total+o).toFixed(2)}</strong>
    </div>
  </div>`,a.innerHTML=i,sessionStorage.removeItem("lastOrderId")})},7109:()=>{},2533:()=>{},4195:()=>{},3162:()=>{},9317:()=>{},9398:()=>{},1649:e=>{"use strict";e.exports=require("next-auth/react")},2785:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},6689:e=>{"use strict";e.exports=require("react")},997:e=>{"use strict";e.exports=require("react/jsx-runtime")},1017:e=>{"use strict";e.exports=require("path")}};var t=require("../webpack-runtime.js");t.C(e);var __webpack_exec__=e=>t(t.s=e),r=t.X(0,[209,450],()=>__webpack_exec__(7259));module.exports=r})();