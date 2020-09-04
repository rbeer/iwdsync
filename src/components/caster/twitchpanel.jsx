import React from 'react'

import { TwitchChatEmbed } from './twitchchatembed'
import { TwitchEmbed } from './twitchembed'

const TwitchPanel = ({ channel, open, videoConfig, withVideo, mode }) => {
    console.log(withVideo, videoConfig, mode)
    return (
        <div className="twitch-panel" open={open} with-video={withVideo.toString()}>
            {videoConfig.twitch_channel && mode === 'viewer' && withVideo && (
                <TwitchEmbed config={videoConfig} />
            )}
            <div className="chat" open={open}>
                <TwitchChatEmbed channel={channel} />
            </div>
        </div>
    )
}

export default TwitchPanel
