import React from 'react'
import { useStore } from 'react-hookstore'

import TwitchChatEmbed from './TwitchChatEmbed'
import TwitchEmbed from './TwitchEmbed'

const TwitchPanel = ({ channel, open, videoConfig, withVideo, mode }) => {
    console.log(withVideo, videoConfig, mode)
    const [
        {
            twitchEmbed: {
                size: [, width],
            },
        },
    ] = useStore('ui')

    return (
        <div
            className="twitch-panel"
            style={{ maxWidth: width }}
            open={open}
            with-video={withVideo.toString()}
        >
            {videoConfig.twitch_channel && (
                /*mode === 'viewer' &&*/ <TwitchEmbed
                    targetId="twitch-player"
                    channel={videoConfig.twitch_channel}
                />
            )}
            <div className="chat" open={open}>
                <TwitchChatEmbed channel={channel} />
            </div>
        </div>
    )
}

export default TwitchPanel
