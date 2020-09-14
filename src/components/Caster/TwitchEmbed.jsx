import React, { useCallback, useRef } from 'react'
import Draggable from 'react-draggable'
import { Resizable } from 'react-resizable'
import { useStore } from 'react-hookstore'
import SVG from 'react-inlinesvg'

import TwitchPlayer from './TwitchPlayer'

import {
    POSITION_TWITCH_EMBED,
    TOGGLE_DROPZONE,
    TOGGLE_ABOVE_CHAT,
    TOGGLE_PANEL_WITH_VIDEO,
} from '../../actions/ui'

import 'react-resizable/css/styles.css'

// TODO: needs to take right-shift of TwitchPanel
//       into account
//
//import useContentBounds from '../../hooks/useContentBounds'
//
//const contentBounds = useContentBounds()
//
//const draggableBounds = useRef({
//top: 0,
//right: 0,
//bottom: contentBounds.bottom - height - contentBounds.top,
//left: -contentBounds.right + width,
//})

const hitsDropzone = ({ x, y }) => x >= -170 && y <= 70

const ResizeHandle = (...resizeHandle) => (
    <SVG src="/icons/angle-up.svg" className={`resize-handle resize-handle-${resizeHandle}`} />
)

export default function TwitchEmbed({ targetId, channel }) {
    const [{ chats, twitchEmbed, showDropzone }, uiDispatch] = useStore('ui')
    const nodeRef = useRef(null)

    const { caster: casterChatOpen } = chats
    const {
        aboveChat,
        translate: [tX, tY],
        size: [height, width],
    } = twitchEmbed

    const withVideo = aboveChat && casterChatOpen

    const x = withVideo ? 0 : tX
    const y = withVideo ? 0 : tY

    const onStop = useCallback(
        (_, { x, y }) => {
            if (!hitsDropzone({ x, y })) {
                uiDispatch({ type: POSITION_TWITCH_EMBED, translate: [x, y] })
            } else {
                uiDispatch({ type: TOGGLE_DROPZONE, showDropzone: false })
                uiDispatch({ type: TOGGLE_ABOVE_CHAT, aboveChat: true })
                uiDispatch({ type: TOGGLE_PANEL_WITH_VIDEO, panelWithVideo: true })
                uiDispatch({ type: POSITION_TWITCH_EMBED, translate: [0, 0] })
            }
        },
        [uiDispatch],
    )

    const onDrag = useCallback(
        (_, data) => {
            if (aboveChat && data.x !== 0 && data.y !== 0) {
                uiDispatch({ type: TOGGLE_ABOVE_CHAT, aboveChat: false })
                uiDispatch({ type: TOGGLE_PANEL_WITH_VIDEO, panelWithVideo: false })
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

    const onResize = (_, { size }) =>
        uiDispatch({
            type: POSITION_TWITCH_EMBED,
            size: [size.height, size.width],
        })

    return (
        <Draggable
            onStop={onStop}
            onDrag={onDrag}
            handle=".drag-handle"
            position={{ x, y }}
            nodeRef={nodeRef}
            //bounds={draggableBounds.current}
        >
            <Resizable
                height={height}
                width={width}
                lockAspectRatio={true}
                handle={ResizeHandle}
                resizeHandles={['n', 'ne', 'e', 's', 'sw', 'w']}
                onResize={onResize}
            >
                <div
                    ref={nodeRef}
                    style={{ height, width }}
                    className="twitch-embed"
                    above-chat={aboveChat.toString()}
                >
                    {/* dev dummy for TwitchPlayer
                    <div
                        id={targetId}
                        style={{ background: '#fff', minHeight: height, minWidth: width }}
                    ></div>
                    */}
                    <TwitchPlayer
                        targetId={targetId}
                        channel={channel}
                        width={width}
                        height={height}
                    />
                    <div className="drag-handle"></div>
                </div>
            </Resizable>
        </Draggable>
    )
}
