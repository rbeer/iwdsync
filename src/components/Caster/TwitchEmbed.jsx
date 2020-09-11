import React, { useRef } from 'react'
import Draggable from 'react-draggable'
import { useStore } from 'react-hookstore'

import TwitchPlayer from './TwitchPlayer'

import { POSITION_TWITCH_EMBED } from '../../actions/ui'
import useContentBounds from '../../hooks/useContentBounds'
import { useCallback } from 'react'

export default function TwitchEmbed({ targetId, channel }) {
    const [{ twitchEmbed }, uiDispatch] = useStore('ui')
    const contentBounds = useContentBounds()
    const nodeRef = useRef(null)

    // TODO:
    //  - set height, width from TwitchPlayer
    //    quality setting when aboveChat
    const {
        aboveChat,
        translate: [tX, tY],
        //size: [height, width],
    } = twitchEmbed
    const x = aboveChat ? 0 : tX
    const y = aboveChat ? 0 : tY
    const height = 225
    const width = 400

    console.log(contentBounds)
    const draggableBounds = {
        top: 0,
        right: 0,
        bottom: contentBounds.bottom - height - contentBounds.top,
        left: -contentBounds.right + width,
    }

    // -418, -540

    console.log(draggableBounds)

    return (
        <Draggable
            handle=".drag-handle"
            position={{ x, y }}
            nodeRef={nodeRef}
            bounds={draggableBounds}
        >
            <div ref={nodeRef} className="twitch-embed">
                <TwitchPlayer targetId={targetId} channel={channel} width={width} height={height} />
                <div className="drag-handle"></div>
            </div>
        </Draggable>
    )
}
