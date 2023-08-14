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
import { RxHamburgerMenu } from "react-icons/rx";
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { proxy } from 'valtio'
import { replaceAll } from "@milkdown/utils";
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'

import '@milkdown/theme-nord/style.css';

const markdownc = `# Milkdown React Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.

\`\`\`sh
sudo pacman -Syyu
\`\`\`

`;

const toBeSupported = () => alert("Because showOpenFilePicker method has not supported on mobile phones, we are searching for better solution instead of File System Access API. Maybe you can only use it after browser on mobile phones support it.")

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
  const [isOpen, setIsOpen] = useState(false)
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }
  let [ifCode, setIfCode] = useState(false)
  return (
    <MilkdownProvider>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction='left'
        className='drawer'
      >
        <h2>Milkdown Editor</h2>
        <button onClick={() => setIfCode(!ifCode)}>{ifCode ? 'Text View' : 'Code View'}</button>
        <button onClick={() =>toBeSupported()}>Open A File</button>
        <button onClick={() =>toBeSupported()}>Save</button>
      </Drawer>
      <MilkdownEditor />
      <button className='btn_lb' onClick={() => {
        toggleDrawer()
      }} style={{ color: ifCode ? '#fff' : '#000' }}>
        <RxHamburgerMenu />
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
