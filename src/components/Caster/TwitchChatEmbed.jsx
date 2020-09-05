import React from 'react'

const getEmbedUrl = (channel) => {
    const parentString = process.env.REACT_APP_TWITCH_PARENTS.split(',')
        .map((parent) => `&parent=${parent}`)
        .join('')

    return `https://www.twitch.tv/embed/${channel}/chat?darkpopout${parentString}`
}

export default function TwitchChatEmbed({ channel = 'iwilldominate' }) {
    return (
        <iframe
            height="100%"
            width="100%"
            title="twitch-chat-embed"
            frameBorder="0px"
            scrolling="yes"
            id={channel}
            src={getEmbedUrl(channel, true)}
        ></iframe>
    )
}
