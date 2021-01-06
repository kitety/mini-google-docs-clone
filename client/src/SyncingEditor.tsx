import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createEditor, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { initialValue } from './slateInitialValue'
import io from 'socket.io-client';


var socket = io('http://localhost:4000');

const SyncingEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const id = useRef(`${Date.now()}`)
  const [value, setValue] = useState<Node[]>(initialValue)
  useEffect(() => {
    socket.on('new-remote-operations', ({ editorId, e }: { editorId: string, e: string }) => {
      // 不同编辑器
      if (id.current !== editorId) {
        setValue(JSON.parse(e))
      }
    })
  }, [])

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={newValue => {
        setValue(newValue)
        socket.emit('new-operations', { editorId: id.current, e: JSON.stringify(newValue) })
      }}
    > <Editable style={{ background: '#fafafa', maxWidth: 800, minHeight: 150 }} /></Slate >
  )
}

export default SyncingEditor;
