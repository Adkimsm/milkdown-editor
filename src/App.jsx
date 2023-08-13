import React, { useEffect } from 'react';
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

import '@milkdown/theme-nord/style.css';

const markdown = `# Milkdown React Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.

\`\`\`sh
sudo pacman -Syyu
\`\`\`

`;

const MilkdownEditor = () => {
  const { get } = useEditor((root) =>
    Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);
      })
      .use(commonmark)
      .use(gfm)
      .use(clipboard)
      .use(prism)
      .use(emoji)
      .use(math)
  );

  return <Milkdown />;
};

export const MilkdownEditorWrapperC = () => {
  return (
    <MilkdownProvider>
      <MilkdownEditor />
    </MilkdownProvider>
  );
};
