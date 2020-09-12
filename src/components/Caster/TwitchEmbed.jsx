import React, { useRef } from 'react'
import Draggable from 'react-draggable'
import { useStore } from 'react-hookstore'

import TwitchPlayer from './TwitchPlayer'

import { POSITION_TWITCH_EMBED, TOGGLE_DROPZONE, TOGGLE_ABOVE_CHAT } from '../../actions/ui'
import useContentBounds from '../../hooks/useContentBounds'
import { useCallback } from 'react'

const hitsDropzone = ({ x, y }) => x >= -170 && y <= 70

export default function TwitchEmbed({ targetId, channel }) {
    const [{ twitchEmbed, showDropzone }, uiDispatch] = useStore('ui')
    const contentBounds = useContentBounds()
    const nodeRef = useRef(null)

    const {
        aboveChat,
        translate: [tX, tY],
        size: [height, width],
    } = twitchEmbed
    const x = aboveChat ? 0 : tX
    const y = aboveChat ? 0 : tY

    const draggableBounds = useRef({
        top: 0,
        right: 0,
        bottom: contentBounds.bottom - height - contentBounds.top,
        left: -contentBounds.right + width,
    })

    const onStop = useCallback(
        (_, { x, y }) => {
            if (!hitsDropzone({ x, y })) {
                uiDispatch({ type: POSITION_TWITCH_EMBED, translate: [x, y] })
            } else {
                uiDispatch({ type: TOGGLE_DROPZONE, showDropzone: false })
                uiDispatch({ type: TOGGLE_ABOVE_CHAT, aboveChat: true })
                uiDispatch({ type: POSITION_TWITCH_EMBED, translate: [0, 0] })
            }
        },
        [uiDispatch],
    )

    const onDrag = useCallback(
        (_, data) => {
            if (aboveChat && data.x !== 0 && data.y !== 0) {
                uiDispatch({ type: TOGGLE_ABOVE_CHAT, aboveChat: false })
            }
            if (!showDropzone && hitsDropzone(data)) {
                return uiDispatch({ type: TOGGLE_DROPZONE, showDropzone: true })
            }
            if (showDropzone && !hitsDropzone(data)) {
                return uiDispatch({ type: TOGGLE_DROPZONE, showDropzone: false })
            }
        },
        [uiDispatch, showDropzone, aboveChat],
    )

    return (
        <Draggable
            onStop={onStop}
            onDrag={onDrag}
            handle=".drag-handle"
            position={{ x, y }}
            nodeRef={nodeRef}
            bounds={draggableBounds.current}
        >
            <div ref={nodeRef} className="twitch-embed">
                <TwitchPlayer targetId={targetId} channel={channel} width={width} height={height} />
                <div className="drag-handle"></div>
            </div>
        </Draggable>
    )
}
