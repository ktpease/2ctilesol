(this.webpackJsonp2ctilesol=this.webpackJsonp2ctilesol||[]).push([[0],{17:function(e,t,i){},18:function(e,t,i){},26:function(e,t){},28:function(e,t,i){},29:function(e,t,i){"use strict";i.r(t);var n=i(4),s=i.n(n),a=i(8),l=i.n(a),o=(i(17),i(18),i(7)),r=i(9),c=i(10),d=i(12),h=i(11),u=i(6),g=i.n(u);function f(e,t,i){var n=t+2,s=i+2,a=[];return e.forEach((function(t){if(null!==t.char&&!0!==t.inRemovalAnim){for(var i=[],l=t.id+1;l<e.length;l++)e[l].char===t.char&&!1===e[l].inRemovalAnim&&i.push(l);if(0!==i.length){console.debug("Checking tile ".concat(t.id," with tiles ").concat(i));var o=[],r=[];i.forEach((function(e){o.push(e%n),r.push(e-e%n)})),i.length>1&&(o.sort((function(e,t){return e-t})),r.sort((function(e,t){return e-t})));var c=[];for(c.push([{segment:[t.id],dir:"R"}]),c.push([{segment:[t.id],dir:"L"}]),c.push([{segment:[t.id],dir:"U"}]),c.push([{segment:[t.id],dir:"D"}]);c.length>0;){var d=c.pop(),h=d.at(-1),u=h.segment.at(-1),g=void 0;switch(h.dir){case"R":if(g=e[u+1],i.includes(g.id)){if(a.push([t.id,g.id]),i.splice(i.indexOf(g.id),1),0===i.length)break;i.forEach((function(e){o.push(e%n),r.push(e-e%n)})),i.length>1&&(o.sort((function(e,t){return e-t})),r.sort((function(e,t){return e-t})));continue}if(null!==g.char&&!0!==g.inRemovalAnim)continue;if(h.segment.push(g.id),d.length<3&&(2!==d.length||o.includes(g.id%n)))if(r[0]<g.id-g.id%n){var f=d.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));f.push({segment:[g.id],dir:"U"}),c.push(f)}else if(r.at(-1)>g.id-g.id%n){var m=d.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));m.push({segment:[g.id],dir:"D"}),c.push(m)}if(2===d.length&&o.at(-1)<g.id%n||g.id%n===n-1)continue;c.push(d);continue;case"L":if(g=e[u-1],i.includes(g.id)){if(a.push([t.id,g.id]),i.splice(i.indexOf(g.id),1),0===i.length)break;i.forEach((function(e){o.push(e%n),r.push(e-e%n)})),i.length>1&&(o.sort((function(e,t){return e-t})),r.sort((function(e,t){return e-t})));continue}if(null!==g.char&&!0!==g.inRemovalAnim)continue;if(h.segment.push(g.id),d.length<3&&(2!==d.length||o.includes(g.id%n)))if(r[0]<g.id-g.id%n){var p=d.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));p.push({segment:[g.id],dir:"U"}),c.push(p)}else if(r.at(-1)>g.id-g.id%n){var b=d.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));b.push({segment:[g.id],dir:"D"}),c.push(b)}if(2===d.length&&o[0]>g.id%n||g.id%n===0)continue;c.push(d);continue;case"D":if(g=e[u+n],i.includes(g.id)){if(a.push([t.id,g.id]),i.splice(i.indexOf(g.id),1),0===i.length)break;i.forEach((function(e){o.push(e%n),r.push(e-e%n)})),i.length>1&&(o.sort((function(e,t){return e-t})),r.sort((function(e,t){return e-t})));continue}if(null!==g.char&&!0!==g.inRemovalAnim)continue;if(h.segment.push(g.id),d.length<3&&(2!==d.length||r.includes(g.id-g.id%n)))if(o[0]<g.id%n){var v=d.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));v.push({segment:[g.id],dir:"L"}),c.push(v)}else if(o.at(-1)>g.id%n){var j=d.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));j.push({segment:[g.id],dir:"R"}),c.push(j)}if(2===d.length&&r.at(-1)<g.id-g.id%n||g.id>=n*(s-1))continue;c.push(d);continue;case"U":if(g=e[u-n],i.includes(g.id)){if(a.push([t.id,g.id]),i.splice(i.indexOf(g.id),1),0===i.length)break;i.forEach((function(e){o.push(e%n),r.push(e-e%n)})),i.length>1&&(o.sort((function(e,t){return e-t})),r.sort((function(e,t){return e-t})));continue}if(null!==g.char&&!0!==g.inRemovalAnim)continue;if(h.segment.push(g.id),d.length<3&&(2!==d.length||r.includes(g.id-g.id%n)))if(o[0]<g.id%n){var T=d.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));T.push({segment:[g.id],dir:"L"}),c.push(T)}else if(o.at(-1)>g.id%n){var A=d.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));A.push({segment:[g.id],dir:"R"}),c.push(A)}if(2===d.length&&r[0]>g.id-g.id%n||g.id<n)continue;c.push(d);continue}}}}})),a}var m=i(0);function p(e){var t=parseInt(e.tile,10);if(isNaN(t)||t<0||t>=43)return e.glyph?Object(m.jsx)("span",{className:"game-tile-glyph game-tile-empty",children:"\ud83c\udc2b\ufe0e"}):Object(m.jsx)("span",{className:"game-tile-emoji game-tile-empty",children:"\ud83c\udc2b"});var i="";if(e.selected?i="game-tile-selected":e.highlighted?i="game-tile-highlighted":e.hinted&&(i="game-tile-hinted"),e.glyph){var n="";return t>=7&&t<=15||4===t?n="game-tile-glyph-red":t>=16&&t<=24||5===t?n="game-tile-glyph-green":t>=25&&t<=33||6===t?n="game-tile-glyph-blue":t>=34&&t<=37?n="game-tile-glyph-flowers":t>=38&&t<=41&&(n="game-tile-glyph-seasons"),Object(m.jsxs)("span",{className:"game-tile-glyph ".concat(n," ").concat(i," ").concat(e.pointer?"game-tile-pointer":""," ").concat(e.fade?"game-tile-anim-fadeout":""),onClick:e.onClick,children:[String.fromCodePoint(126976+t),"\ufe0e"]})}return Object(m.jsx)("span",{className:"game-tile-emoji ".concat(i," ").concat(e.pointer?"game-tile-pointer":""," ").concat(e.fade?"game-tile-anim-fadeout":""),onClick:e.onClick,children:String.fromCodePoint(126976+t)})}function b(e){if(e.node&&e.node.length>0){var t="";return e.node.forEach((function(e,i){0===i&&(t="game-path-"),t=t.concat(e)})),Object(m.jsx)("span",{className:"game-path ".concat(t," game-path-anim-fadeout")})}return null}i(28);var v=function(e){Object(d.a)(i,e);var t=Object(h.a)(i);function i(e){var n;return Object(r.a)(this,i),(n=t.call(this,e)).state={useEmoji:!1,allowDeselect:!0,showMatchingTiles:!0,showAllValidMatches:!0,boardWidth:17,boardHeight:8,seed:1,tiles:[],selectedTile:null,tileHistory:[],hintedTiles:[],allValidMatches:[],allValidMatchTiles:[],pathingTiles:[],pathingTilesAlt:[],useAltPathingTiles:!1,horizontalTileMap:[],verticalTileMap:[]},n}return Object(c.a)(i,[{key:"componentDidMount",value:function(){this.checkEmojiMode(),this.generateBoard()}},{key:"checkEmojiMode",value:function(){window.navigator&&/Windows NT \d{2}/.test(window.navigator.userAgent)&&this.setState({useEmoji:!0})}},{key:"generateBoard",value:function(e,t,i){var n=this,s=[],a=[],l=t||this.state.boardWidth,r=i||this.state.boardHeight,c=0,d=-1,h=-1,u=isNaN(parseInt(e,10))?g()().int32()>>>0:parseInt(e,10)>>>0,f=g()(u),m=Object(o.a)(Array(34).keys()),p=0;window.navigator&&window.navigator.userAgent.includes("Chrome")&&window.navigator.userAgent.includes("Mobile")&&(m[4]=42);for(var b=m.length-1;b>0;b--)p=Math.floor(f()*(b+1)),d=m[b],m[b]=m[p],m[p]=d;for(var v=0;v<l+2;v++)c=s.push({id:c,char:null,inRemovalAnim:!1});for(var j=0;j<r;j++){c=s.push({id:c,char:null,inRemovalAnim:!1});for(var T=0;T<l;T++)0===(h=(h+1)%4)&&(d=(d+1)%m.length),a.push(c),c=s.push({id:c,char:m[d],inRemovalAnim:!1});c=s.push({id:c,char:null,inRemovalAnim:!1})}for(var A=0;A<l+2;A++)c=s.push({id:c,char:null,inRemovalAnim:!1});for(var M=a.length-1;M>0;M--)p=Math.floor(f()*(M+1)),d=s[a[M]].char,s[a[M]].char=s[a[p]].char,s[a[p]].char=d;console.log("Game board seed is ".concat(u)),this.setState({tiles:s,boardWidth:l,boardHeight:r,seed:u,selectedTile:null,tileHistory:[],hintedTiles:[],allValidMatches:[],pathingTiles:[],pathingTilesAlt:[]},(function(){n.generateHorizontalMap(),n.generateVerticalMap(),n.checkAllValidMatches()}))}},{key:"checkAllValidMatches",value:function(){var e=this;this.setState({allValidMatches:f(this.state.tiles,this.state.boardWidth,this.state.boardHeight)},(function(){e.setState({allValidMatchTiles:Object(o.a)(new Set(e.state.allValidMatches.flat()))}),!0===e.state.showAllValidMatches&&console.log(e.state.allValidMatches.reduce((function(t,i){return t.concat("[".concat(i[0]%(e.state.boardWidth+2)-1,",").concat((i[0]-i[0]%(e.state.boardWidth+2)-(e.state.boardWidth+2))/(e.state.boardWidth+2)," <-> ").concat(i[1]%(e.state.boardWidth+2)-1,",").concat((i[1]-i[1]%(e.state.boardWidth+2)-(e.state.boardWidth+2))/(e.state.boardWidth+2),"] "))}),""))}))}},{key:"handleTileClick",value:function(e){var t=this;if(null!==this.state.tiles[e].char&&!0!==this.state.tiles[e].inRemovalAnim)if(this.state.selectedTile!==e){if(console.debug("Clicked ".concat(e)),null!==this.state.selectedTile&&this.state.tiles[e].char===this.state.tiles[this.state.selectedTile].char){var i=function(e,t,i,n,s){if(e===t)return null;var a=n+2,l=s+2,o=[],r=null,c=t%a-e%a,d=(t-t%a-(e-e%a))/a,h=0;console.debug("tile X delta: ".concat(c)),console.debug("tile Y delta: ".concat(d)),(0!==d||c>0)&&o.push([{segment:[e],dir:"R"}]),(0!==d||c<0)&&(c<0?o.push([{segment:[e],dir:"L"}]):o.unshift([{segment:[e],dir:"L"}])),(0!==c||d>0)&&(d>=0?o.push([{segment:[e],dir:"D"}]):o.unshift([{segment:[e],dir:"D"}])),(0!==c||d<0)&&o.push([{segment:[e],dir:"U"}]);for(var u=0;u<o.length;u++)console.debug(o[u]);for(;o.length>0;){var g=o.pop();if(h++,console.debug("Checking path: ".concat(g.at(-1).segment," | ").concat(g.at(-1).dir," | length: ").concat(g.length," | queue: ").concat(o.length)),null===r||3!==g.length){var f=g.at(-1),m=f.segment.at(-1),p=void 0;switch(f.dir){case"R":if((p=i[m+1]).id===t){if(console.debug("- Found simplest path?"),f.segment.push(p.id),g.length<3)return console.debug("-- It is!"),console.debug("".concat(h," PATHS EATEN")),g;console.debug("-- Maybe?"),r=g;continue}if(null!==p.char&&!0!==p.inRemovalAnim){console.debug("- Obstruction in path");continue}if(f.segment.push(p.id),g.length<3&&(2!==g.length||t%a===p.id%a))if(t-t%a<p.id-p.id%a){console.debug("- Add path U");var b=g.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));b.push({segment:[p.id],dir:"U"}),d<0?o.push(b):o.unshift(b)}else if(t-t%a>p.id-p.id%a){console.debug("- Add path D");var v=g.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));v.push({segment:[p.id],dir:"D"}),d>=0?o.push(v):o.unshift(v)}if(2===g.length&&t%a<p.id%a||p.id%a===a-1){console.debug("- Do not proceed further, will miss");continue}console.debug("- Continuing path"),c>=0?o.push(g):o.unshift(g);continue;case"L":if((p=i[m-1]).id===t){if(console.debug("- Found simplest path"),f.segment.push(p.id),g.length<3)return console.debug("-- It is!"),console.debug("".concat(h," PATHS EATEN")),g;console.debug("-- Maybe?"),r=g;continue}if(null!==p.char&&!0!==p.inRemovalAnim){console.debug("- Obstruction in path");continue}if(f.segment.push(p.id),g.length<3&&(2!==g.length||t%a===p.id%a))if(t-t%a<p.id-p.id%a){console.debug("- Add path U");var j=g.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));j.push({segment:[p.id],dir:"U"}),d<0?o.push(j):o.unshift(j)}else if(t-t%a>p.id-p.id%a){console.debug("- Add path D");var T=g.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));T.push({segment:[p.id],dir:"D"}),d>=0?o.push(T):o.unshift(T)}if(2===g.length&&t%a>p.id%a||p.id%a===0){console.debug("- Do not proceed further, will miss");continue}console.debug("- Continuing path"),c<0?o.push(g):o.unshift(g);continue;case"D":if((p=i[m+a]).id===t){if(console.debug("- Found simplest path"),f.segment.push(p.id),g.length<3)return console.debug("-- It is!"),console.debug("".concat(h," PATHS EATEN")),g;console.debug("-- Maybe?"),r=g;continue}if(null!==p.char&&!0!==p.inRemovalAnim){console.debug("- Obstruction in path");continue}if(f.segment.push(p.id),g.length<3&&(2!==g.length||t-t%a===p.id-p.id%a))if(t%a<p.id%a){console.debug("- Add path L");var A=g.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));A.push({segment:[p.id],dir:"L"}),c<0?o.push(A):o.unshift(A)}else if(t%a>p.id%a){console.debug("- Add path R");var M=g.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));M.push({segment:[p.id],dir:"R"}),c>=0?o.push(M):o.unshift(M)}if(2===g.length&&t-t%a<p.id-p.id%a||p.id>=a*(l-1)){console.debug("- Do not proceed further, will miss");continue}console.debug("- Continuing path"),d>=0?o.push(g):o.unshift(g);continue;case"U":if((p=i[m-a]).id===t){if(console.debug("- Found simplest path"),f.segment.push(p.id),g.length<3)return console.debug("-- It is!"),console.debug("".concat(h," PATHS EATEN")),g;console.debug("-- Maybe?"),r=g;continue}if(null!==p.char&&!0!==p.inRemovalAnim){console.debug("- Obstruction in path");continue}if(f.segment.push(p.id),g.length<3&&(2!==g.length||t-t%a===p.id-p.id%a))if(t%a<p.id%a){console.debug("- Add path L");var y=g.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));y.push({segment:[p.id],dir:"L"}),c<0?o.push(y):o.unshift(y)}else if(t%a>p.id%a){console.debug("- Add path R");var k=g.map((function(e){return{segment:[].concat(e.segment),dir:e.dir}}));k.push({segment:[p.id],dir:"R"}),c>=0?o.push(k):o.unshift(k)}if(2===g.length&&t-t%a>p.id-p.id%a||p.id<a){console.debug("- Do not proceed further, will miss");continue}console.debug("- Continuing path"),d<0?o.push(g):o.unshift(g);continue}}else console.debug("- Looking for less-line paths")}return console.debug("".concat(h," PATHS EATEN")),r}(e,this.state.selectedTile,this.state.tiles.slice(),this.state.boardWidth,this.state.boardHeight);if(null!==i){console.debug(i);var n=this.state.tiles.slice();n.forEach((function(e){!0===e.inRemovalAnim&&(e.inRemovalAnim=!1,e.char=null)})),n[e].inRemovalAnim=!0,n[this.state.selectedTile].inRemovalAnim=!0;var s=this.state.tileHistory.slice();s.push({char:this.state.tiles[e].char,tile1:e,tile2:this.state.selectedTile});var a=this.state.tiles.map((function(){return[]}));return i.forEach((function(e){e.segment.forEach((function(t){a[t].push(e.dir)}))})),a[this.state.selectedTile].push("-start"),a[e].push("-end"),this.setState({tiles:n,selectedTile:null,tileHistory:s,hintedTiles:[]},(function(){t.checkAllValidMatches()})),void(!0===this.state.useAltPathingTiles?this.setState({pathingTiles:this.state.tiles.map((function(){return[]})),pathingTilesAlt:a,useAltPathingTiles:!1}):this.setState({pathingTiles:a,pathingTilesAlt:this.state.tiles.map((function(){return[]})),useAltPathingTiles:!0}))}}if(!0!==this.state.showMatchingTiles)this.setState({selectedTile:e});else{var l=this.state.tiles.filter((function(i){return i.char===t.state.tiles[e].char}));this.setState({hintedTiles:l,selectedTile:e})}}else!0===this.state.allowDeselect&&(this.setState({selectedTile:null,hintedTiles:[]}),console.debug("Unclicked ".concat(e)))}},{key:"undoMatch",value:function(){var e=this;if(this.state.tileHistory.length>0){var t=this.state.tiles.slice(),i=this.state.tileHistory.pop();t[i.tile1].char=i.char,t[i.tile1].inRemovalAnim=!1,t[i.tile2].char=i.char,t[i.tile2].inRemovalAnim=!1,this.setState({tiles:t,hintedTiles:[],pathingTiles:[],pathingTilesAlt:[],selectedTile:null},(function(){e.checkAllValidMatches()}))}}},{key:"generateHorizontalMap",value:function(){for(var e=[],t=0;t<this.state.boardHeight+2;t++)e[t]=this.state.tiles.slice(t*(this.state.boardWidth+2),(t+1)*(this.state.boardWidth+2));this.setState({horizontalTileMap:e})}},{key:"renderHorizontalMap",value:function(){var e=this,t=[];if("undefined"!==typeof this.state.horizontalTileMap){for(var i=0;i<this.state.horizontalTileMap.length;i++)t[i]=Object(m.jsx)("div",{children:this.state.horizontalTileMap[i].map((function(t){return e.renderTile(t)}))},"board-hori-row"+i);return t}}},{key:"generateVerticalMap",value:function(){for(var e=this,t=[],i=function(i){t[i]=e.state.tiles.filter((function(t,n){return n%(e.state.boardWidth+2)===i})).reverse()},n=0;n<this.state.boardWidth+2;n++)i(n);this.setState({verticalTileMap:t})}},{key:"renderVerticalMap",value:function(){var e=this,t=[];if("undefined"!==typeof this.state.verticalTileMap){for(var i=0;i<this.state.verticalTileMap.length;i++)t[i]=Object(m.jsx)("div",{children:this.state.verticalTileMap[i].map((function(t){return e.renderTile(t)}))},"board-vert-row"+i);return t}}},{key:"renderTile",value:function(e){var t=this;return Object(m.jsxs)(m.Fragment,{children:[Object(m.jsx)(p,{tile:e.char,glyph:!this.state.useEmoji,selected:e.id===this.state.selectedTile,hinted:this.state.hintedTiles.includes(e)&&!e.inRemovalAnim,highlighted:this.state.allValidMatchTiles.includes(e.id),fade:e.inRemovalAnim,onClick:function(){return t.handleTileClick(e.id)}},e.id),Object(m.jsx)(b,{node:this.state.pathingTiles[e.id]},"node"+e.id),Object(m.jsx)(b,{node:this.state.pathingTilesAlt[e.id]},"altnode"+e.id)]})}},{key:"render",value:function(){var e=this;return Object(m.jsx)(m.Fragment,{children:Object(m.jsxs)("div",{children:[Object(m.jsx)("div",{className:"game-board game-board-horizontal ".concat(this.state.useEmoji?"game-board-emoji":"game-board-glyph"),children:this.renderHorizontalMap()}),Object(m.jsx)("div",{className:"game-board game-board-vertical ".concat(this.state.useEmoji?"game-board-emoji":"game-board-glyph"),children:this.renderVerticalMap()}),Object(m.jsxs)("div",{children:[Object(m.jsx)("button",{onClick:function(){return e.setState((function(e){return{useEmoji:!e.useEmoji}}))},children:"Change tile type"}),Object(m.jsx)("button",{onClick:function(){return e.generateBoard(e.state.seed)},children:"Reset board"}),Object(m.jsx)("button",{onClick:function(){return e.undoMatch()},disabled:0===this.state.tileHistory.length,children:"Undo"})]}),Object(m.jsxs)("div",{children:[Object(m.jsx)("button",{onClick:function(){return e.generateBoard(null,8,5)},children:"New board (easy)"}),Object(m.jsx)("button",{onClick:function(){return e.generateBoard(null,12,7)},children:"New board (medium)"}),Object(m.jsx)("button",{onClick:function(){return e.generateBoard(null,17,8)},children:"New board (hard)"})]}),Object(m.jsxs)("div",{children:["Board #",this.state.seed]})]})})}}]),i}(s.a.Component);var j=function(){return Object(m.jsx)("div",{className:"App",children:Object(m.jsx)(v,{})})},T=function(e){e&&e instanceof Function&&i.e(3).then(i.bind(null,30)).then((function(t){var i=t.getCLS,n=t.getFID,s=t.getFCP,a=t.getLCP,l=t.getTTFB;i(e),n(e),s(e),a(e),l(e)}))};l.a.render(Object(m.jsx)(s.a.StrictMode,{children:Object(m.jsx)(j,{})}),document.getElementById("root")),T()}},[[29,1,2]]]);
//# sourceMappingURL=main.53589a16.chunk.js.map