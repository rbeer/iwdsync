import React from 'react'
import SVG from 'react-inlinesvg'
import { useStore } from 'react-hookstore'

import { POSITION_TWITCH_EMBED, TOGGLE_ABOVE_CHAT, TOGGLE_CHAT } from '../../actions/ui'

export const ChatToggle = ({ state = false, channelTag = '{?!}', mirrorX = false, toggle }) => (
    <SVG
        src="/icons/chat-toggle.svg"
        data-active={state}
        data-channel-tag={channelTag}
        preProcessor={(code) => code.replace('{ch}', channelTag)}
        className={`chat-toggle ${mirrorX ? 'mirror-x ' : ''}`}
        onClick={toggle}
    />
)

// TODO: get this from outside
const casterChannelTag = 'IWD'

const Controls = () => {
    const [
        {
            chats,
            aboveChat,
            panelWithVideo,
            twitchEmbed: {
                translate: [tX, tY],
                size: [, width],
            },
        },
        uiDispatch,
    ] = useStore('ui')

    const toggleChat = ({ currentTarget }) => {
        const { channelTag, active: activeString } = currentTarget.dataset
        // current state; negate this to toggle
        const active = activeString === 'true'
        const isCaster = channelTag === casterChannelTag
        uiDispatch({
            type: TOGGLE_CHAT,
            channelTag,
            casterChannelTag,
            active,
            isCaster,
        })

        if (isCaster && !aboveChat) {
            let translateX = !active ? 350 : -350
            if (panelWithVideo) {
                translateX = !active ? width : -width
                uiDispatch({ type: TOGGLE_ABOVE_CHAT, aboveChat: !active })
            }
            uiDispatch({ type: POSITION_TWITCH_EMBED, translate: [tX + translateX, tY] })
        }
        //if (aboveChat && !casterChatOpen) {
        //uiDispatch({ type: POSITION_TWITCH_EMBED, translate: [-width, 0] })
        //}
    }

    return (
        <div className="controls">
            <div>
                <ChatToggle channelTag="LCS" state={chats.side === 'LCS'} toggle={toggleChat} />
                <ChatToggle channelTag="LEC" state={chats.side === 'LEC'} toggle={toggleChat} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="live-view-flicker">Live</span>
                <SVG src="/iwd.svg" className="iwd-logo" />
                <span className="live-view-flicker">View</span>
            </div>
            <ChatToggle
                channelTag={casterChannelTag}
                mirrorX
                state={chats.caster}
                toggle={toggleChat}
            />
        </div>
    )
}

export default Controls
