!function(e){function t(t){for(var n,s,a=t[0],l=t[1],c=t[2],h=0,u=[];h<a.length;h++)s=a[h],Object.prototype.hasOwnProperty.call(r,s)&&r[s]&&u.push(r[s][0]),r[s]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);for(p&&p(t);u.length;)u.shift()();return i.push.apply(i,c||[]),o()}function o(){for(var e,t=0;t<i.length;t++){for(var o=i[t],n=!0,a=1;a<o.length;a++){var l=o[a];0!==r[l]&&(n=!1)}n&&(i.splice(t--,1),e=s(s.s=o[0]))}return e}var n={},r={1:0},i=[];function s(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,s),o.l=!0,o.exports}s.m=e,s.c=n,s.d=function(e,t,o){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(s.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(o,n,function(t){return e[t]}.bind(null,n));return o},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var a=window.webpackJsonp=window.webpackJsonp||[],l=a.push.bind(a);a.push=t,a=a.slice();for(var c=0;c<a.length;c++)t(a[c]);var p=l;i.push([5,0]),o()}({11:function(e,t,o){"use strict";o.r(t);o(2);var n=o(0),r={name:"VscodeColorPicker",render:function(e){return e("div",{staticClass:"vscode-color-picker"},[])},props:{color:{type:[String,n.a],default:"#0000"},presentations:{type:Array,default:[]},presentationIndex:{type:Number,default:0},pixelRatio:{type:Number,default:1}},model:{prop:"color",event:"change"},watch:{color:{handler:function(e){this.$pickerInstance&&this.$pickerInstance.getColor().toString()!==n.b.toColor(e).toString()&&this.$pickerInstance.setColor(e)}},presentations:{handler:function(e){this.$pickerInstance&&this.$pickerInstance.setPresentations(e)}},presentationIndex:{handler:function(e){this.$pickerInstance&&this.$pickerInstance.setPresentationIndex(e)}},pixelRatio:{handler:function(e){this.$pickerInstance&&this.$pickerInstance.setPixelRatio(e)}}},methods:{getOriginalColor:function(){if(this.$pickerInstance)return this.$pickerInstance.getOriginalColor()},setOriginalColor:function(e){this.$pickerInstance&&this.$pickerInstance.setOriginalColor(e)}},mounted:function(){var e=this;this.$nextTick((function(){var t=document.getElementsByClassName("vscode-color-picker")[0];for(e.$pickerInstance&&e.$pickerInstance.dispose();0!==t.childNodes.length;)t.removeChild(t.childNodes[0]);e.$pickerInstance=new n.b(t,{color:e.color,presentations:e.presentations,presentationIndex:e.presentationIndex,pixelRatio:e.pixelRatio}),e.$pickerInstance.onColorChanged((function(t){e.$emit("change",t)})),e.$pickerInstance.onColorFlushed((function(t){e.$emit("flush",t)})),e.$pickerInstance.onPresentationChanged((function(t){e.$emit("presentation",t,e.presentations.indexOf(t))}))}))},beforeDestroy:function(){this.$pickerInstance.dispose()}};new Vue({data(){const e=n.b.toColor("#187");return{show:!0,color:"#187",originalColor:"#187",presentationIndex:0,pixelRatio:1,presentations:[{label:n.b.formatColor(e,n.b.ColorType.RGB)},{label:n.b.formatColor(e,n.b.ColorType.HEX)},{label:n.b.formatColor(e,n.b.ColorType.HSL)}]}},render(e){return e("div",{id:"test"},[...this.show?[e(r,{props:{color:this.color,presentations:this.presentations,presentationIndex:this.presentationIndex,pixelRatio:this.pixelRatio},on:{change:this.onChange,presentation:(e,t)=>console.log(e,t)},ref:"picker"})]:[],e("button",{on:{click:this.onClick}},this.show?"confirm":"pick"),e("button",{on:{click:this.onClickSet}},"set"),e("p","picked: "+this.color.toString()),e("p","original: "+this.originalColor.toString())])},methods:{onClickSet(){this.color="#89a",this.originalColor=this.color},onClick(){this.show=!this.show,this.originalColor=this.color},onChange(e){this.color=n.b.formatColor(e,n.b.ColorType.RGB),this.presentations[0].label=n.b.formatColor(e,n.b.ColorType.RGB),this.presentations[1].label=n.b.formatColor(e,n.b.ColorType.HEX),this.presentations[2].label=n.b.formatColor(e,n.b.ColorType.HSL)}}}).$mount("#test")},5:function(e,t,o){e.exports=o(11)}});