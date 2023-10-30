'use client';

import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

interface EditorState {
  isSubmitting: boolean;
}
type EditorContextDispatch = {
  dispatch: Dispatch<SetStateAction<EditorState>>;
};

const EditorContext = createContext<EditorState | null>(null);
const EditorDispatchContext = createContext<EditorContextDispatch | null>(null);

export const useEditorContext = () => useContext(EditorContext) as EditorState;
export const useEditorDispatchContext = () =>
  useContext(EditorDispatchContext) as EditorContextDispatch;

const initialState: EditorState = {
  isSubmitting: false,
};

export function EditorProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<EditorState>(initialState);
  const dispatchProviderValue = useMemo(
    () => ({
      dispatch: setState,
    }),
    [],
  );
  return (
    <EditorContext.Provider value={state}>
      <EditorDispatchContext.Provider value={dispatchProviderValue}>
        {children}
      </EditorDispatchContext.Provider>
    </EditorContext.Provider>
  );
}
