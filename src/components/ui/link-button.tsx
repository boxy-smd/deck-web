import type { Editor } from '@tiptap/react'
import { Youtube } from 'lucide-react'

import { Toggle } from './toggle'

interface LinkButtonProps {
  editor: Editor
}

export function LinkButton({ editor }: LinkButtonProps) {
  const addYouTubeVideo = () => {
    const url = prompt('Enter YouTube URL')

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      })
    }
  }

  return (
    <div className="control-group">
      <div className="button-group">
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button id="add" onClick={addYouTubeVideo}>
          <Toggle>
            <Youtube />
          </Toggle>
        </button>
      </div>
    </div>
  )
}
