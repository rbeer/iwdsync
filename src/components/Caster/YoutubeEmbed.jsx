import React, { useState, useEffect, useCallback } from 'react'
import { useStore } from 'react-hookstore'
import useWebSocket from 'react-use-websocket'

import api from '../../api/api'
import { wsBase } from '../../configs/gen'
import { SET_YOUTUBE } from '../../actions/players'

export default function YoutubeEmbed({ caster, myCaster, youtubeLiveUrl, csrf, mode }) {
    const isCaster = mode === 'caster' && myCaster.url_path === caster
    const wsUrl = `${wsBase}/ws/${isCaster ? 'caster' : 'viewer'}/${caster}`

    const [{ youtube: player }, dispatchPlayers] = useStore('players')
    const [isPlaying, setPlaying] = useState(false)
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
                                setPlaying(false)
                                sendJsonMessage({ type: 'CONTROL', action: 'PAUSE' })
                                break
                            case playerState.PLAYING:
                                setPlaying(true)
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
        if (isCaster && isPlaying) {
            window.heartbeatInterval = window.setInterval(sendHeartbeat, 1000)
        }
        return () => window.clearInterval(window.heartbeatInterval)
    }, [isCaster, isPlaying, sendHeartbeat])

    // act on ws messages to viewer
    useEffect(() => {
        if (isCaster || !player?.playerInfo?.currentTime) return
        switch (lastJsonMessage?.type) {
            case 'CONTROL':
                const action = lastJsonMessage.action
                if (action === 'PLAY') {
                    console.info(`[YoutubeEmbed|CONTROL] Playing`)
                    player.playVideo()
                    setPlaying(true)
                    break
                }
                if (action === 'PAUSE') {
                    console.info(`[YoutubeEmbed|CONTROL] Pausing`)
                    player.pauseVideo()
                    setPlaying(false)
                    break
                }
                break
            case 'HEARTBEAT':
                const delta = lastJsonMessage.youtube_time - player.getCurrentTime()
                if (isPlaying && Math.abs(delta) >= 2) {
                    console.info(`[YoutubeEmbed|HEARTBEAT] Delay > 2; synchronising...`)
                    player.seekTo(lastJsonMessage.youtube_time)
                }
                break
            default:
                break
        }
    }, [isCaster, isPlaying, player, lastJsonMessage])

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
