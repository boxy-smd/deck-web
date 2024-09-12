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
        <Toggle className='rounded-md border-none bg-slate-50 py-3'>
          <Youtube className='size-4' />
        </Toggle>
      </div>
    </div>
  )
}
