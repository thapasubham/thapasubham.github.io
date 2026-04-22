import{c as N,f as F,d as H,e as _}from"../chunks/CHoZu6Ne.js";import{k as $,E as O,ag as z,aD as M,aE as K,aj as B,ar as V,au as v,as as y,at as E,a1 as j,x as S,z as r,aF as A}from"../chunks/DV2Zx_ai.js";import{B as G,b as U}from"../chunks/CX0lA9Qv.js";import{l as W,b as Y,s as k}from"../chunks/CUCYHfEA.js";import{g as P}from"../chunks/CG8c7pld.js";function q(m,l,...e){var t=new G(m);$(()=>{const a=l()??null;t.ensure(a,a&&(c=>a(c,...e)))},O)}const Q=!0,X="always",ie=Object.freeze(Object.defineProperty({__proto__:null,prerender:Q,trailingSlash:X},Symbol.toStringTag,{value:"Module"}));var J=F('<canvas class="mesh-grid-canvas svelte-1sasiy2" aria-hidden="true"></canvas>');function Z(m,l){z(l,!0);let e,t,a,c,i,u,d=0;const w=performance.now(),b=`
		attribute vec2 aPosition;
		void main() {
			gl_Position = vec4(aPosition, 0.0, 1.0);
		}
	`,x=`
		precision highp float;

		uniform float uTime;
		uniform vec2 uResolution;

		float waveNoise(vec2 p) {
			return sin(p.x) * sin(p.y);
		}

		void main() {
			vec2 uv = gl_FragCoord.xy / uResolution.xy;
			uv -= 0.5;
			uv.x *= uResolution.x / uResolution.y;

			float t = uTime * 0.15;
			float n1 = waveNoise(uv * 3.0 + vec2(t, t));
			float n2 = waveNoise(uv * 2.0 - vec2(t * 0.7, t * 0.4));
			float n3 = waveNoise(uv * 4.0 + vec2(-t * 0.5, t * 0.8));
			float blend = (n1 + n2 + n3) * 0.33 * 0.5 + 0.5;

			vec3 surface = vec3(0.976, 0.976, 0.984);
			vec3 accent = vec3(0.729, 0.0, 0.173);
			vec3 ink = vec3(0.102, 0.110, 0.114);

			vec3 col = mix(surface, accent, blend * 0.22);
			col = mix(col, ink, (1.0 - blend) * 0.08);
			col *= 0.94;

			gl_FragColor = vec4(col, 1.0);
		}
	`;function s(){if(!e||!t)return;const n=Math.min(window.devicePixelRatio??1,2);e.width=Math.floor(window.innerWidth*n),e.height=Math.floor(window.innerHeight*n),e.style.width=`${window.innerWidth}px`,e.style.height=`${window.innerHeight}px`,t.viewport(0,0,e.width,e.height)}function f(){if(d=requestAnimationFrame(f),!t||!a)return;const n=(performance.now()-w)/1e3;t.useProgram(a),t.uniform1f(i,n),t.uniform2f(u,e.width,e.height),t.drawArrays(t.TRIANGLES,0,6)}M(()=>{const n=e.getContext("webgl",{alpha:!0,antialias:!0});n&&(t=n,a=W(t,b,x),t.useProgram(a),c=Y(t,a,"aPosition"),i=t.getUniformLocation(a,"uTime"),u=t.getUniformLocation(a,"uResolution"),s(),window.addEventListener("resize",s),f())}),K(()=>{window.removeEventListener("resize",s),cancelAnimationFrame(d),t&&c&&t.deleteBuffer(c),t&&a&&t.deleteProgram(a)});var h=J();U(h,n=>e=n,()=>e),N(m,h),B()}var ee=F('<div class="font-body text-on-surface selection:bg-primary selection:text-on-primary flex min-h-screen flex-col antialiased"><div class="bg-surface fixed inset-0 -z-50"></div> <!>  <aside class="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col border-r border-[#ba002c]/20 bg-[#f3f3f5] py-8 pt-24 lg:flex"><div class="mb-12 px-6"><div class="font-headline text-lg font-black text-on-surface">SYSTEM_STATUS</div> <div class="text-primary font-label text-[10px] tracking-[0.2em] uppercase">ONLINE // VER_2.0.4</div></div> <nav class="flex-1 space-y-2"><a href="/"><span class="font-label text-sm font-bold tracking-widest uppercase">Portal</span></a> <a href="/#about"><span class="font-label text-sm font-bold tracking-widest uppercase">Dossier</span></a> <a href="/#contact"><span class="font-label text-sm font-bold tracking-widest uppercase">Interface</span></a></nav> <div class="mt-auto px-4 pb-8"><p class="bg-primary text-on-primary font-headline clip-path-button hover:bg-on-surface inline-block w-full py-3 text-center text-xs tracking-widest transition-colors">DOWNLOAD_CV</p></div></aside> <main class="relative min-h-screen overflow-hidden pt-24 lg:ml-64"><!></main></div>');function ce(m,l){z(l,!0);let e=A(""),t=A(!1),a;function c(){clearTimeout(a),r(t,!0),a=setTimeout(()=>{r(t,!1),i()},750)}function i(){if(S(t))return;const o=document.getElementById("about"),g=document.getElementById("contact"),p=window.scrollY,T=window.innerHeight,C=Math.max(0,document.documentElement.scrollHeight-T);if(p<72){r(e,"");return}if(p>=C-100){r(e,"contact");return}if(o&&g){const R=T*.38,D=g.getBoundingClientRect().top,I=o.getBoundingClientRect().top;D<=R?r(e,"contact"):I<=R?r(e,"about"):r(e,"")}}async function u(o,g){if(o.defaultPrevented||o.button!==0||o.metaKey||o.ctrlKey||o.shiftKey||o.altKey)return;if(o.preventDefault(),g==="portal"){r(e,""),await P("/"),window.scrollTo({top:0,behavior:"auto"}),i();return}const p=g==="about"?"about":"contact";r(e,p,!0),r(t,!0),await P(`/#${p}`,{noScroll:!0,keepFocus:!0}),document.getElementById(p)?.scrollIntoView({behavior:"smooth",block:"start"}),c()}M(()=>(window.addEventListener("scroll",i,{passive:!0}),i(),()=>{window.removeEventListener("scroll",i),clearTimeout(a)}));var d=ee(),w=v(y(d),2);Z(w,{});var b=v(w,2),x=v(y(b),2),s=y(x),f=v(s,2),h=v(f,2);E(x),j(2),E(b);var n=v(b,2),L=y(n);q(L,()=>l.children),E(n),E(d),V(()=>{k(s,1,`clip-path-tactical relative z-10 mx-4 block flex items-center gap-4 p-4 transition-all ${S(e)===""?"cursor-default bg-[#ba002c] text-white":"cursor-pointer border-[#ba002c] text-[#1a1c1d] opacity-50 hover:border-l-4 hover:bg-[#e2e2e4] hover:opacity-100"}`),k(f,1,`clip-path-tactical relative z-10 mx-4 block flex items-center gap-4 p-4 transition-all ${S(e)==="about"?"cursor-default bg-[#ba002c] text-white":"cursor-pointer border-[#ba002c] text-[#1a1c1d] opacity-50 hover:border-l-4 hover:bg-[#e2e2e4] hover:opacity-100"}`),k(h,1,`clip-path-tactical relative z-10 mx-4 block flex items-center gap-4 p-4 transition-all ${S(e)==="contact"?"cursor-default bg-[#ba002c] text-white":"cursor-pointer border-[#ba002c] text-[#1a1c1d] opacity-50 hover:border-l-4 hover:bg-[#e2e2e4] hover:opacity-100"}`)}),_("click",s,o=>u(o,"portal")),_("click",f,o=>u(o,"about")),_("click",h,o=>u(o,"contact")),N(m,d),B()}H(["click"]);export{ce as component,ie as universal};
