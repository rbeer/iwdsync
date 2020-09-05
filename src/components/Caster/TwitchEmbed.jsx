import React, { useRef } from 'react'
import Moveable from 'react-moveable'
import { useStore } from 'react-hookstore'

import TwitchPlayer from './TwitchPlayer'

import { POSITION_TWITCH_EMBED } from '../../actions/ui'
import useContentBounds from '../../hooks/useContentBounds'

const translateStyle = (translate) => `translate(${translate[0]}px, ${translate[1]}px)`

export default function TwitchEmbed({ targetId, channel }) {
    const [ui, uiDispatch] = useStore('ui')
    const contentBounds = useContentBounds()

    const moveableTarget = useRef()
    const eventSink = useRef()

    return (
        <div className="twitch-video">
            <TwitchPlayer
                style={{
                    height: ui.twitchEmbed.size.height,
                    width: ui.twitchEmbed.size.width,
                    transform: `translate(${ui.twitchEmbed.translate[0]}px, ${ui.twitchEmbed.translate[1]}px)`,
                }}
                ref={moveableTarget}
                targetId={targetId}
                channel={channel}
                width="100%"
                height="100%"
            ></TwitchPlayer>
            <Moveable
                target={moveableTarget.current}
                zoom={1}
                origin={true}
                renderDirections={[]}
                snappable={true}
                bounds={contentBounds}
                padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                draggable={true}
                dragArea={true}
                throttleDrag={0}
                onDragStart={({ set }) => {
                    set(ui.twitchEmbed.translate)
                }}
                onDrag={({ target, beforeTranslate }) => {
                    target.style.transform = translateStyle(beforeTranslate)
                }}
                onDragEnd={({ lastEvent }) => {
                    if (lastEvent) {
                        uiDispatch({
                            type: POSITION_TWITCH_EMBED,
                            translate: lastEvent.beforeTranslate,
                            size: ui.twitchEmbed.size,
                        })
                    }
                }}
                resizable={true}
                keepRatio={true}
                edge={true}
                onResizeStart={({ setOrigin, dragStart }) => {
                    setOrigin(['%', '%'])
                    eventSink.current.style.visibility = 'visible'
                    dragStart && dragStart.set(ui.twitchEmbed.translate)
                }}
                onResize={({ target, width, height, drag }) => {
                    const { beforeTranslate } = drag

                    target.style.width = `${width}px`
                    target.style.height = `${height}px`
                    target.style.transform = translateStyle(beforeTranslate)
                }}
                onResizeEnd={({ lastEvent }) => {
                    if (lastEvent) {
                        uiDispatch({
                            type: POSITION_TWITCH_EMBED,
                            translate: lastEvent.drag.beforeTranslate,
                            size: { height: lastEvent.height, width: lastEvent.width },
                        })
                        eventSink.current.style.visibility = 'hidden'
                    }
                }}
            />
            <div className="moveable-event-sink" ref={eventSink}></div>
        </div>
    )
}
