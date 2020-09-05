import { useState, useCallback } from 'react'

const useTwitchPlayer = (targetId, config) => {
    const [player, setPlayer] = useState()

    const load = useCallback(() => {
        const new_player = new window.Twitch.Player(targetId, config)
        setPlayer(new_player)
    }, [targetId, config])

    return [player, load]
}

export default useTwitchPlayer
