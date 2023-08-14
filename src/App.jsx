import React, { useState, useEffect } from 'react';
import './App.css';
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';
import { gfm } from '@milkdown/preset-gfm';
import { clipboard } from '@milkdown/plugin-clipboard';
import { prism } from '@milkdown/plugin-prism';
import { math } from '@milkdown/plugin-math';
import { emoji } from '@milkdown/plugin-emoji';
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { RxCode } from "react-icons/rx";
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { proxy } from 'valtio'
import { replaceAll } from "@milkdown/utils";

import '@milkdown/theme-nord/style.css';

const markdownc = `# Milkdown React Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.

\`\`\`sh
sudo pacman -Syyu
\`\`\`

`;

const store = proxy({
  value: markdownc
})

const MilkdownEditor = () => {
  const { get } = useEditor((root) =>
    Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdownc);
        const listenerO = ctx.get(listenerCtx);
        listenerO.markdownUpdated((ctx, markdown, prevmarkdown) => {
          if (markdown === prevmarkdown) return;
          store.value = markdown;
        });
      })
      .use(listener)
      .use(commonmark)
      .use(gfm)
      .use(clipboard)
      .use(prism)
      .use(emoji)
      .use(math)
  );

  useEffect(() => {
    const e = get();
    if (!e) return;
    e.action(replaceAll(store.value));
  }, [store.value]);

  return <Milkdown />;
};

export const MilkdownEditorWrapperC = () => {
  let [ifCode, setIfCode] = useState(false)
  return (
    <MilkdownProvider>
      <MilkdownEditor />
      <button className='btn_lb' onClick={() => setIfCode(!ifCode)} style={{ color: ifCode ? '#fff' : '#000' }}>
        <RxCode />
      </button>
      <div className='code' style={{ display: ifCode ? 'block' : 'none' }}>
        <CodeMirror 
        value={store.value} 
        theme={vscodeDark} 
        extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]} 
        onChange={(value) => {
          store.value = value
        }} />
      </div>
    </MilkdownProvider>
  );
};
