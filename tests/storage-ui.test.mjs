import test from 'node:test';import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';import {readFile} from 'node:fs/promises';import {createRequire} from 'node:module';
import {FINGERPRINTS} from '../lib/testing/adapter.js';
import {readWithStatus,DEFAULTS} from '../lib/testing/settings.js';
const require=createRequire(import.meta.url);
test('storage denial and malformed preferences report different default states',()=>{
  assert.deepEqual(readWithStatus({getItem(){throw Error('synthetic denied');}}),{settings:DEFAULTS,issue:'unavailable'});
  assert.deepEqual(readWithStatus({getItem:()=>'{broken'}),{settings:DEFAULTS,issue:'invalid'});
  assert.equal(readWithStatus({getItem:()=>null}).issue,null);
});
test('real React panel keeps styles active on quota failure and clears warning after successful retry',async()=>{
  const dom=new JSDOM('<html><head></head><body><main></main></body></html>',{url:'http://synthetic-comfort.test',runScripts:'outside-only'}),{window}=dom;
  const prior={window:globalThis.window,document:globalThis.document,act:globalThis.IS_REACT_ACT_ENVIRONMENT};globalThis.window=window;globalThis.document=window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const React=require('react'),{createRoot}=require('react-dom/client');let root;
  const effects=[];let Panel,plugin;
  try{
    for(const [name,markers]of Object.entries(FINGERPRINTS)){const style=window.document.createElement('style');style.dataset.pluginCss='@deepseek-ai/dsh-client-ui-chat/'+name;style.textContent=markers.map(x=>x+' }').join('\n');window.document.head.append(style);}
    window.__ModuleLoader__={load:({factory})=>{plugin=factory(require);}};window.eval(await readFile(new URL('../lib/client.js',import.meta.url),'utf8'));
    plugin.apply({effect:fn=>{const dispose=fn();effects.push(dispose);return dispose;},locale:{register:()=>()=>{}},slots:{inject:(_,fn)=>fn(),register:(_,component)=>{Panel=component;return()=>{};}}});
    root=createRoot(window.document.querySelector('main'));await React.act(async()=>root.render(React.createElement(Panel)));
    const setItem=window.Storage.prototype.setItem;
    for(const exception of ['QuotaExceededError','SecurityError']){
      window.Storage.prototype.setItem=function(){throw new window.DOMException('SYNTHETIC_ONLY',exception);};
      const select=window.document.querySelector('select');await React.act(async()=>{select.value='compact';select.dispatchEvent(new window.Event('change',{bubbles:true}));});
      assert(window.document.querySelector('.cc-storage').textContent.includes('未能保存'));assert(window.document.querySelector('.cc-status').textContent.includes('已启用'));assert(window.document.getElementById('dsh-chat-comfort-style-v1').textContent.includes('padding: 12px 16px'));
      window.Storage.prototype.setItem=setItem;await React.act(async()=>{select.value='comfortable';select.dispatchEvent(new window.Event('change',{bubbles:true}));});assert.equal(window.document.querySelector('.cc-storage'),null);assert.equal(readWithStatus(window.localStorage).settings.density,'comfortable');
    }
    window.localStorage.setItem('dsh-chat-comfort.settings.v1','{broken');await React.act(async()=>window.dispatchEvent(new window.StorageEvent('storage',{key:'dsh-chat-comfort.settings.v1'})));assert(window.document.querySelector('.cc-storage').textContent.includes('无法解析'));
    await React.act(async()=>root.unmount());root=null;for(const dispose of effects.reverse())dispose?.();assert.equal(window.document.querySelector('style[data-plugin-css="dsh-chat-comfort/panel.css"]'),null);
  }finally{if(root)await React.act(async()=>root.unmount());dom.window.close();globalThis.window=prior.window;globalThis.document=prior.document;globalThis.IS_REACT_ACT_ENVIRONMENT=prior.act;}
});
