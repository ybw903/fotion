import React, { useCallback, useEffect, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { Extension, EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";

export default function useCodeMirror(
  extensions: Extension[],
  docs?: string,
  handleUpdate?: (docs: string) => void
) {
  const [element, setElement] = useState<HTMLElement>();

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const view = new EditorView({
      state: EditorState.create({
        doc: docs,
        extensions: [
          basicSetup,
          javascript(),
          EditorState.tabSize.of(2),
          keymap.of([indentWithTab]),
          EditorView.updateListener.of((evt) => {
            if (handleUpdate) handleUpdate(evt.state.doc.toString());
          }),
          ...extensions,
        ],
      }),
      parent: element,
    });
    return () => view?.destroy();
  }, [element]);

  return { ref };
}
