(this.webpackJsonp2ctilesol=this.webpackJsonp2ctilesol||[]).push([[0],{24:function(e,t,i){},25:function(e,t,i){},44:function(e,t){},46:function(e,t,i){},47:function(e,t,i){},48:function(e,t,i){},49:function(e,t,i){"use strict";i.r(t);var n=i(1),s=i.n(n),a=i(7),r=i.n(a),l=(i(24),i(25),i(10)),o=i(15),h=i(16),c=i(19),u=i(18),d=i(8),g=i.n(d),f=i(9),m=i.n(f);function p(e,t,i){var n=t+2,s=i+2,a=[];return e.forEach((function(t){if(null!==t.char&&!0!==t.inRemovalAnim){for(var i=[],r=t.id+1;r<e.length;r++)e[r].char===t.char&&!1===e[r].inRemovalAnim&&i.push(r);if(0!==i.length){var l=[],o=[];i.forEach((function(e){l.push(e%n),o.push(e-e%n)})),i.length>1&&(l.sort((function(e,t){return e-t})),o.sort((function(e,t){return e-t})));var h=[];for(h.push([{segment:[t.id],dir:"R"}]),h.push([{segment:[t.id],dir:"L"}]),h.push([{segment:[t.id],dir:"U"}]),h.push([{segment:[t.id],dir:"D"}]);h.length>0;){var c=h.pop(),u=c.at(-1),d=u.segment.at(-1),g=void 0;switch(u.dir){case"R":if(g=e[d+1],i.includes(g.id)){if(a.push([t.id,g.id]),i.splice(i.indexOf(g.id),1),0===i.length)break;i.forEach((function(e){l.push(e%n),o.push(e-e%n)})),i.length>1&&(l.sort((function(e,t){return e-t})),o.sort((function(e,t){return e-t})));continue}if(null!==g.char&&!0!==g.inRemovalAnim)continue;if(u.segment.push(g.id),c.length<3&&(2!==c.length||l.includes(g.id%n))){if(o[0]<g.id-g.id%n){var f=c.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));f.push({segment:[g.id],dir:"U"}),h.push(f)}if(o.at(-1)>g.id-g.id%n){var m=c.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));m.push({segment:[g.id],dir:"D"}),h.push(m)}}if(2===c.length&&l.at(-1)<g.id%n||g.id%n===n-1)continue;h.push(c);continue;case"L":if(g=e[d-1],i.includes(g.id)){if(a.push([t.id,g.id]),i.splice(i.indexOf(g.id),1),0===i.length)break;i.forEach((function(e){l.push(e%n),o.push(e-e%n)})),i.length>1&&(l.sort((function(e,t){return e-t})),o.sort((function(e,t){return e-t})));continue}if(null!==g.char&&!0!==g.inRemovalAnim)continue;if(u.segment.push(g.id),c.length<3&&(2!==c.length||l.includes(g.id%n))){if(o[0]<g.id-g.id%n){var p=c.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));p.push({segment:[g.id],dir:"U"}),h.push(p)}if(o.at(-1)>g.id-g.id%n){var v=c.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));v.push({segment:[g.id],dir:"D"}),h.push(v)}}if(2===c.length&&l[0]>g.id%n||g.id%n===0)continue;h.push(c);continue;case"D":if(g=e[d+n],i.includes(g.id)){if(a.push([t.id,g.id]),i.splice(i.indexOf(g.id),1),0===i.length)break;i.forEach((function(e){l.push(e%n),o.push(e-e%n)})),i.length>1&&(l.sort((function(e,t){return e-t})),o.sort((function(e,t){return e-t})));continue}if(null!==g.char&&!0!==g.inRemovalAnim)continue;if(u.segment.push(g.id),c.length<3&&(2!==c.length||o.includes(g.id-g.id%n))){if(l[0]<g.id%n){var b=c.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));b.push({segment:[g.id],dir:"L"}),h.push(b)}if(l.at(-1)>g.id%n){var j=c.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));j.push({segment:[g.id],dir:"R"}),h.push(j)}}if(2===c.length&&o.at(-1)<g.id-g.id%n||g.id>=n*(s-1))continue;h.push(c);continue;case"U":if(g=e[d-n],i.includes(g.id)){if(a.push([t.id,g.id]),i.splice(i.indexOf(g.id),1),0===i.length)break;i.forEach((function(e){l.push(e%n),o.push(e-e%n)})),i.length>1&&(l.sort((function(e,t){return e-t})),o.sort((function(e,t){return e-t})));continue}if(null!==g.char&&!0!==g.inRemovalAnim)continue;if(u.segment.push(g.id),c.length<3&&(2!==c.length||o.includes(g.id-g.id%n))){if(l[0]<g.id%n){var T=c.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));T.push({segment:[g.id],dir:"L"}),h.push(T)}if(l.at(-1)>g.id%n){var A=c.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));A.push({segment:[g.id],dir:"R"}),h.push(A)}}if(2===c.length&&o[0]>g.id-g.id%n||g.id<n)continue;h.push(c);continue}}}}})),a}var v=i(0);function b(e){var t=parseInt(e.tile,10);if(isNaN(t)||t<0||t>=43)return e.glyph?Object(v.jsx)("span",{className:"game-tile-glyph game-tile-empty",children:"\ud83c\udc2b\ufe0e"}):Object(v.jsx)("span",{className:"game-tile-emoji game-tile-empty",children:"\ud83c\udc2b"});var i="";if(e.selected?i="game-tile-selected":e.highlighted?i="game-tile-highlighted":e.hinted&&(i="game-tile-hinted"),e.glyph){var n="";return t>=7&&t<=15||4===t?n="game-tile-glyph-red":t>=16&&t<=24||5===t?n="game-tile-glyph-green":t>=25&&t<=33||6===t?n="game-tile-glyph-blue":t>=34&&t<=37?n="game-tile-glyph-flowers":t>=38&&t<=41&&(n="game-tile-glyph-seasons"),Object(v.jsxs)("span",{className:"game-tile-glyph ".concat(n," ").concat(i," ").concat(e.pointer?"game-tile-pointer":""," ").concat(e.fade?"game-tile-anim-fadeout":""),onClick:e.onClick,children:[String.fromCodePoint(126976+t),"\ufe0e"]})}return Object(v.jsx)("span",{className:"game-tile-emoji ".concat(i," ").concat(e.pointer?"game-tile-pointer":""," ").concat(e.fade?"game-tile-anim-fadeout":""),onClick:e.onClick,children:String.fromCodePoint(126976+t)})}function j(e){if(e.node&&e.node.length>0){var t="";return e.node.forEach((function(e,i){0===i&&(t="game-path-"),t=t.concat(e)})),Object(v.jsx)("span",{className:"game-path ".concat(t," game-path-anim-fadeout")})}return null}var T=i(17),A=s.a.forwardRef((function(e,t){var i=Object(T.useStopwatch)({autoStart:!0}),n=i.seconds,a=i.minutes,r=i.hours,l=i.start,o=i.pause,h=i.reset;return s.a.useImperativeHandle(t,(function(){return{start:l,pause:o,reset:h}})),Object(v.jsxs)("span",{style:{textAlign:"center"},children:[r.toString().padStart(2,"0"),":",a.toString().padStart(2,"0"),":",n.toString().padStart(2,"0")]})}));i(46),i(47),i(48);g.a.setAppElement(document.getElementById("root"));var M=function(e){Object(c.a)(i,e);var t=Object(u.a)(i);function i(e){var n;return Object(o.a)(this,i),(n=t.call(this,e)).state={showSettingsModal:!1,useEmoji:!1,allowDeselect:!0,showMatchingTiles:!0,showAllValidMatches:!0,boardWidth:17,boardHeight:8,seed:1,tiles:[],selectedTile:null,tileHistory:[],hintedTiles:[],allValidMatches:[],allValidMatchTiles:[],pathingTiles:[],pathingTilesAlt:[],useAltPathingTiles:!1,horizontalTileMap:[],verticalTileMap:[]},n.timerRef=s.a.createRef(),n}return Object(h.a)(i,[{key:"componentDidMount",value:function(){this.checkEmojiMode(),this.generateBoard()}},{key:"checkEmojiMode",value:function(){var e=this;navigator.userAgentData?navigator.userAgentData.getHighEntropyValues(["platform","platformVersion"]).then((function(t){"Windows"===t.platform&&parseInt(t.platformVersion)>=10&&e.setState({useEmoji:!0})})):window.navigator&&/Windows NT \d{2}/.test(window.navigator.userAgent)&&this.setState({useEmoji:!0})}},{key:"generateBoard",value:function(e,t,i){var n=this,s=[],a=[],r=t||this.state.boardWidth,o=i||this.state.boardHeight,h=0,c=-1,u=-1,d=isNaN(parseInt(e,10))?m()().int32()>>>0:parseInt(e,10)>>>0,g=m()(d),f=Object(l.a)(Array(34).keys()),p=0;(navigator.userAgentData?!0===navigator.userAgentData.brands.some((function(e){return"Chromium"===e.brand}))&&!0===navigator.userAgentData.mobile:window.navigator&&window.navigator.userAgent.includes("Chrome")&&window.navigator.userAgent.includes("Mobile"))&&(f[4]=42);for(var v=f.length-1;v>0;v--)p=Math.floor(g()*(v+1)),c=f[v],f[v]=f[p],f[p]=c;for(var b=0;b<r+2;b++)h=s.push({id:h,char:null,inRemovalAnim:!1});for(var j=0;j<o;j++){h=s.push({id:h,char:null,inRemovalAnim:!1});for(var T=0;T<r;T++)0===(u=(u+1)%4)&&(c=(c+1)%f.length),a.push(h),h=s.push({id:h,char:f[c],inRemovalAnim:!1});h=s.push({id:h,char:null,inRemovalAnim:!1})}for(var A=0;A<r+2;A++)h=s.push({id:h,char:null,inRemovalAnim:!1});for(var M=a.length-1;M>0;M--)p=Math.floor(g()*(M+1)),c=s[a[M]].char,s[a[M]].char=s[a[p]].char,s[a[p]].char=c;this.setState({tiles:s,boardWidth:r,boardHeight:o,seed:d,selectedTile:null,tileHistory:[],hintedTiles:[],allValidMatches:[],pathingTiles:[],pathingTilesAlt:[],showSettingsModal:!1},(function(){n.generateHorizontalMap(),n.generateVerticalMap(),n.checkAllValidMatches(),n.timerRef.current.reset()}))}},{key:"checkAllValidMatches",value:function(){var e=this;this.setState((function(e){return{allValidMatches:p(e.tiles,e.boardWidth,e.boardHeight)}}),(function(){e.setState((function(e){return{allValidMatchTiles:Object(l.a)(new Set(e.allValidMatches.flat()))}}))}))}},{key:"handleTileClick",value:function(e){var t=this;if(null!==this.state.tiles[e].char&&!0!==this.state.tiles[e].inRemovalAnim)if(this.state.selectedTile!==e){if(null!==this.state.selectedTile&&this.state.tiles[e].char===this.state.tiles[this.state.selectedTile].char){var i=function(e,t,i,n,s){if(e===t)return null;var a=n+2,r=s+2,l=[],o=null,h=t%a-e%a,c=(t-t%a-(e-e%a))/a;for((0!==c||h>0)&&l.push([{segment:[e],dir:"R"}]),(0!==c||h<0)&&(h<0?l.push([{segment:[e],dir:"L"}]):l.unshift([{segment:[e],dir:"L"}])),(0!==h||c>0)&&(c>=0?l.push([{segment:[e],dir:"D"}]):l.unshift([{segment:[e],dir:"D"}])),(0!==h||c<0)&&l.push([{segment:[e],dir:"U"}]);l.length>0;){var u=l.pop();if(null===o||3!==u.length){var d=u.at(-1),g=d.segment.at(-1),f=void 0;switch(d.dir){case"R":if((f=i[g+1]).id===t){if(d.segment.push(f.id),u.length<3)return u;o=u;continue}if(null!==f.char&&!0!==f.inRemovalAnim)continue;if(d.segment.push(f.id),u.length<3&&(2!==u.length||t%a===f.id%a))if(t-t%a<f.id-f.id%a){var m=u.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));m.push({segment:[f.id],dir:"U"}),c<0?l.push(m):l.unshift(m)}else if(t-t%a>f.id-f.id%a){var p=u.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));p.push({segment:[f.id],dir:"D"}),c>=0?l.push(p):l.unshift(p)}if(2===u.length&&t%a<f.id%a||f.id%a===a-1)continue;h>=0?l.push(u):l.unshift(u);continue;case"L":if((f=i[g-1]).id===t){if(d.segment.push(f.id),u.length<3)return u;o=u;continue}if(null!==f.char&&!0!==f.inRemovalAnim)continue;if(d.segment.push(f.id),u.length<3&&(2!==u.length||t%a===f.id%a))if(t-t%a<f.id-f.id%a){var v=u.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));v.push({segment:[f.id],dir:"U"}),c<0?l.push(v):l.unshift(v)}else if(t-t%a>f.id-f.id%a){var b=u.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));b.push({segment:[f.id],dir:"D"}),c>=0?l.push(b):l.unshift(b)}if(2===u.length&&t%a>f.id%a||f.id%a===0)continue;h<0?l.push(u):l.unshift(u);continue;case"D":if((f=i[g+a]).id===t){if(d.segment.push(f.id),u.length<3)return u;o=u;continue}if(null!==f.char&&!0!==f.inRemovalAnim)continue;if(d.segment.push(f.id),u.length<3&&(2!==u.length||t-t%a===f.id-f.id%a))if(t%a<f.id%a){var j=u.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));j.push({segment:[f.id],dir:"L"}),h<0?l.push(j):l.unshift(j)}else if(t%a>f.id%a){var T=u.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));T.push({segment:[f.id],dir:"R"}),h>=0?l.push(T):l.unshift(T)}if(2===u.length&&t-t%a<f.id-f.id%a||f.id>=a*(r-1))continue;c>=0?l.push(u):l.unshift(u);continue;case"U":if((f=i[g-a]).id===t){if(d.segment.push(f.id),u.length<3)return u;o=u;continue}if(null!==f.char&&!0!==f.inRemovalAnim)continue;if(d.segment.push(f.id),u.length<3&&(2!==u.length||t-t%a===f.id-f.id%a))if(t%a<f.id%a){var A=u.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));A.push({segment:[f.id],dir:"L"}),h<0?l.push(A):l.unshift(A)}else if(t%a>f.id%a){var M=u.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));M.push({segment:[f.id],dir:"R"}),h>=0?l.push(M):l.unshift(M)}if(2===u.length&&t-t%a>f.id-f.id%a||f.id<a)continue;c<0?l.push(u):l.unshift(u);continue}}}return o}(e,this.state.selectedTile,this.state.tiles.slice(),this.state.boardWidth,this.state.boardHeight);if(null!==i){var n=this.state.tiles.slice();n.forEach((function(e){!0===e.inRemovalAnim&&(e.inRemovalAnim=!1,e.char=null)})),n[e].inRemovalAnim=!0,n[this.state.selectedTile].inRemovalAnim=!0;var s=this.state.tileHistory.slice();s.push({char:this.state.tiles[e].char,tile1:e,tile2:this.state.selectedTile});var a=this.state.tiles.map((function(){return[]}));return i.forEach((function(e){e.segment.forEach((function(t){a[t].push(e.dir)}))})),a[this.state.selectedTile].push("-start"),a[e].push("-end"),this.setState({tiles:n,selectedTile:null,tileHistory:s,hintedTiles:[]},(function(){t.checkAllValidMatches()})),void(!0===this.state.useAltPathingTiles?this.setState((function(e){return{pathingTiles:e.tiles.map((function(){return[]})),pathingTilesAlt:a,useAltPathingTiles:!1}})):this.setState((function(e){return{pathingTiles:a,pathingTilesAlt:e.tiles.map((function(){return[]})),useAltPathingTiles:!0}})))}}if(!0!==this.state.showMatchingTiles)this.setState({selectedTile:e});else{var r=this.state.tiles.filter((function(i){return i.char===t.state.tiles[e].char}));this.setState({hintedTiles:r,selectedTile:e})}}else!0===this.state.allowDeselect&&this.setState({selectedTile:null,hintedTiles:[]})}},{key:"undoMatch",value:function(){var e=this;if(this.state.tileHistory.length>0){var t=this.state.tiles.slice(),i=this.state.tileHistory.pop();t[i.tile1].char=i.char,t[i.tile1].inRemovalAnim=!1,t[i.tile2].char=i.char,t[i.tile2].inRemovalAnim=!1,this.setState({tiles:t,hintedTiles:[],pathingTiles:[],pathingTilesAlt:[],selectedTile:null},(function(){e.checkAllValidMatches()}))}}},{key:"showSettingsModal",value:function(){this.timerRef.current.pause(),this.setState({showSettingsModal:!0})}},{key:"hideSettingsModal",value:function(){this.timerRef.current.start(),this.setState({showSettingsModal:!1})}},{key:"generateHorizontalMap",value:function(){for(var e=[],t=0;t<this.state.boardHeight+2;t++)e[t]=this.state.tiles.slice(t*(this.state.boardWidth+2),(t+1)*(this.state.boardWidth+2));this.setState({horizontalTileMap:e})}},{key:"renderHorizontalMap",value:function(){var e=this,t=[];if("undefined"!==typeof this.state.horizontalTileMap){for(var i=0;i<this.state.horizontalTileMap.length;i++)t[i]=Object(v.jsx)("div",{children:this.state.horizontalTileMap[i].map((function(t){return e.renderTileAndPath(t,"hori")}))},"board-hori-row"+i);return t}}},{key:"generateVerticalMap",value:function(){for(var e=this,t=[],i=function(i){t[i]=e.state.tiles.filter((function(t,n){return n%(e.state.boardWidth+2)===i})).reverse()},n=0;n<this.state.boardWidth+2;n++)i(n);this.setState({verticalTileMap:t})}},{key:"renderVerticalMap",value:function(){var e=this,t=[];if("undefined"!==typeof this.state.verticalTileMap){for(var i=0;i<this.state.verticalTileMap.length;i++)t[i]=Object(v.jsx)("div",{children:this.state.verticalTileMap[i].map((function(t){return e.renderTileAndPath(t,"vert")}))},"board-vert-row"+i);return t}}},{key:"renderTileAndPath",value:function(e,t){var i=this;return Object(v.jsxs)("span",{children:[Object(v.jsx)(b,{tile:e.char,glyph:!this.state.useEmoji,selected:e.id===this.state.selectedTile,hinted:this.state.hintedTiles.includes(e)&&!e.inRemovalAnim,highlighted:this.state.allValidMatchTiles.includes(e.id),fade:e.inRemovalAnim,onClick:function(){return i.handleTileClick(e.id)}}),Object(v.jsx)(j,{node:this.state.pathingTiles[e.id]}),Object(v.jsx)(j,{node:this.state.pathingTilesAlt[e.id]})]},e.id)}},{key:"render",value:function(){var e=this;return Object(v.jsxs)(v.Fragment,{children:[Object(v.jsxs)("div",{children:[Object(v.jsx)("div",{className:"game-board game-board-horizontal ".concat(this.state.useEmoji?"game-board-emoji":"game-board-glyph"),children:this.renderHorizontalMap()}),Object(v.jsx)("div",{className:"game-board game-board-vertical ".concat(this.state.useEmoji?"game-board-emoji":"game-board-glyph"),children:this.renderVerticalMap()})]}),Object(v.jsxs)("div",{className:"game-bar",children:[Object(v.jsx)(A,{ref:this.timerRef}),Object(v.jsx)("button",{className:"settings-button ".concat(this.state.showSettingsModal?"settings-button-opened":""),onClick:function(){return e.showSettingsModal()},children:"\u2261"}),Object(v.jsx)("button",{className:"undo-button",onClick:function(){return e.undoMatch()},disabled:0===this.state.tileHistory.length,children:"\u2b8c"})]}),Object(v.jsxs)(g.a,{isOpen:this.state.showSettingsModal,contentLabel:"Settings",onRequestClose:function(){return e.hideSettingsModal()},shouldCloseOnOverlayClick:!1,children:[Object(v.jsxs)("div",{children:[Object(v.jsxs)("div",{children:["Board #",this.state.seed]}),Object(v.jsx)("button",{onClick:function(){return e.setState((function(e){return{useEmoji:!e.useEmoji}}))},children:"Change tile type"}),Object(v.jsx)("button",{onClick:function(){return e.generateBoard(e.state.seed)},children:"Reset board"}),Object(v.jsx)("button",{onClick:function(){return e.undoMatch()},disabled:0===this.state.tileHistory.length,children:"Undo"})]}),Object(v.jsxs)("div",{children:[Object(v.jsx)("button",{onClick:function(){return e.generateBoard(null,8,5)},children:"New board (easy)"}),Object(v.jsx)("button",{onClick:function(){return e.generateBoard(null,12,7)},children:"New board (medium)"}),Object(v.jsx)("button",{onClick:function(){return e.generateBoard(null,17,8)},children:"New board (hard)"})]}),Object(v.jsx)("button",{onClick:function(){return e.hideSettingsModal()},children:"Close Modal"})]})]})}}]),i}(s.a.Component);var O=function(){return Object(v.jsx)("div",{className:"App",children:Object(v.jsx)(M,{})})},y=function(e){e&&e instanceof Function&&i.e(3).then(i.bind(null,50)).then((function(t){var i=t.getCLS,n=t.getFID,s=t.getFCP,a=t.getLCP,r=t.getTTFB;i(e),n(e),s(e),a(e),r(e)}))};r.a.render(Object(v.jsx)(s.a.StrictMode,{children:Object(v.jsx)(O,{})}),document.getElementById("root")),y()}},[[49,1,2]]]);
//# sourceMappingURL=main.46c601ee.chunk.js.map