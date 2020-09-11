import React, { useRef, useEffect } from 'react'

import { twitchParents } from '../../configs/gen'
import { default as useTwitchPlayer, loadTwitchPlayerApi } from '../../hooks/twitchPlayer'

const TwitchPlayer = React.memo(({ targetId, channel, width, height, ...props }) => {
    const ref = useRef(null)
    const playerConfig = useRef({
        channel,
        // width/height for the <iframe>
        width: '100%',
        height: '100%',
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

    return <div ref={ref} id={targetId} style={{ width, height }} {...props}></div>
})

export default TwitchPlayer
