import React from 'react'

import TwitchChatEmbed from './TwitchChatEmbed'
import TwitchEmbed from './TwitchEmbed'

const TwitchPanel = ({ channel, open, videoConfig, withVideo, mode }) => {
    console.log(withVideo, videoConfig, mode)
    return (
        <div className="twitch-panel" open={open} with-video={withVideo.toString()}>
            {videoConfig.twitch_channel && mode === 'viewer' && withVideo && (
                <TwitchEmbed targetId="twitch-player" channel={videoConfig.twitch_channel} />
            )}
            <div className="chat" open={open}>
                <TwitchChatEmbed channel={channel} />
            </div>
        </div>
    )
}

export default TwitchPanel
