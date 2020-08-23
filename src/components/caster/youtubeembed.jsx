import React, { useState, useEffect, useCallback } from 'react'
import { useStore } from 'react-hookstore'
import useWebSocket from 'react-use-websocket'

import api from '../../api/api'
import { SET_YOUTUBE } from '../../actions/players'

export function YoutubeEmbed({ caster, myCaster, youtubeLiveUrl, csrf }) {
    const isCaster = myCaster.url_path === caster
    const wsUrl = `ws://localhost:8000/ws/${isCaster ? 'caster' : 'viewer'}/iwd`

    const [{ youtube: player }, dispatchPlayers] = useStore('players')
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const { sendJsonMessage, lastJsonMessage } = useWebSocket(wsUrl)
    const youtubeId = youtubeLiveUrl ? youtubeLiveUrl.split('?v=')[1] : undefined

    const updateYoutubeUrl = () => {
        api.caster.update({ youtube_url: youtubeUrl }, csrf).then(() => {
            // why are you doing a full page refresh here?
            window.location.reload()
        })
    }

    const createPlayer = useCallback(() => {
        if (youtubeId) {
            const new_player = new window.YT.Player('ytplayer', {
                videoId: youtubeId,
                width: '100%',
                height: '100%',
                events: {
                    onReady: (event) => {
                        event.target.mute()
                        // event.target.playVideo()
                    },
                    onStateChange: (event) => {
                        if (!isCaster) return

                        const playerState = window.YT.PlayerState
                        switch (event.data) {
                            case playerState.PAUSED:
                                sendJsonMessage({ type: 'CONTROL', action: 'PAUSE' })
                                break
                            case playerState.PLAYING:
                                sendJsonMessage({ type: 'CONTROL', action: 'PLAY' })
                                break
                            default:
                                break
                        }
                    },
                },
            })
            dispatchPlayers({
                type: SET_YOUTUBE,
                player: new_player,
            })
        }
    }, [youtubeId, dispatchPlayers, sendJsonMessage, isCaster])

    const sendHeartbeat = useCallback(() => {
        if (player?.getCurrentTime) {
            if (player.getPlayerState() === window.YT.PlayerState.PLAYING) {
                sendJsonMessage({
                    type: 'HEARTBEAT',
                    youtube_time: player.getCurrentTime(),
                })
            }
        }
    }, [player, sendJsonMessage])

    // set player on load
    useEffect(() => {
        window.YT.ready(createPlayer)
    }, [createPlayer])

    useEffect(() => {
        if (isCaster) {
            window.heartbeatInterval = window.setInterval(sendHeartbeat, 1000)
        }
    }, [isCaster, sendHeartbeat])

    useEffect(() => {
        console.log(lastJsonMessage)
    }, [lastJsonMessage])

    return (
        <>
            <div id="ytplayer"></div>
            <div>
                {isCaster && (
                    <>
                        <div>
                            <input
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        updateYoutubeUrl()
                                    }
                                }}
                                style={{ display: 'inline-block' }}
                                type="text"
                                value={youtubeUrl}
                                onChange={(event) => setYoutubeUrl(event.target.value)}
                            />
                            <button onClick={updateYoutubeUrl} style={{ display: 'inline-block' }}>
                                Set youtube URL
                            </button>
                        </div>
                        {/* <button onClick={() => updateSyncTime(player.playerInfo.currentTime)}> */}
                        {/*     Set Sync Time for Viewers */}
                        {/* </button> */}
                    </>
                )}
                {!isCaster && (
                    <>
                        <div style={{ display: 'inline-block', marginRight: 8 }}>offset</div>
                        <input
                            onKeyDown={(event) => {}}
                            style={{ width: 100 }}
                            type="number"
                            step="0.1"
                        />
                        <button>sync to caster</button>
                    </>
                )}
            </div>
        </>
    )
}
