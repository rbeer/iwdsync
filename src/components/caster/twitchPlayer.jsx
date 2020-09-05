import React, { useRef, useEffect } from 'react'

import { twitchParents } from '../../configs/gen'
import { default as useTwitchPlayer, loadTwitchPlayerApi } from '../../hooks/twitchPlayer'

const TwitchPlayer = React.memo(
    React.forwardRef(({ targetId, channel, width, height, ...props }, ref) => {
        if (!ref) {
            ref = useRef()
        }
        const playerConfig = useRef({
            channel,
            width,
            height,
            parent: twitchParents,
        })
        const [, load] = useTwitchPlayer(targetId, playerConfig.current)

        useEffect(() => {
            ref.current.innerHTML = ''
            if (Boolean(window?.Twitch.Player)) {
                return load()
            }
            loadTwitchPlayerApi(load)
        }, [load, ref])

        return <div ref={ref} id={targetId} {...props}></div>
    }),
)

export default TwitchPlayer
