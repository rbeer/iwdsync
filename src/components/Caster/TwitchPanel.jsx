import React from 'react'
import { useStore } from 'react-hookstore'

import TwitchChatEmbed from './TwitchChatEmbed'
import TwitchEmbed from './TwitchEmbed'

const TwitchPanel = ({ channel, open, videoConfig, mode }) => {
    const [
        {
            twitchEmbed: {
                size: [height, width],
                aboveChat,
            },
            showDropzone,
        },
    ] = useStore('ui')

    return (
        <div
            className="twitch-panel"
            style={{ maxWidth: width }}
            open={open}
            with-video={aboveChat.toString()}
        >
            {videoConfig.twitch_channel && (
                /*mode === 'viewer' &&*/ <TwitchEmbed
                    targetId="twitch-player"
                    channel={videoConfig.twitch_channel}
                />
            )}
            {showDropzone && !aboveChat && (
                <div className="dropzone" style={{ width, height }}></div>
            )}
            <div className="chat" open={open}>
                <TwitchChatEmbed channel={channel} />
            </div>
        </div>
    )
}

export default TwitchPanel
