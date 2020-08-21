import React, { useState, useEffect, useCallback } from 'react'
import { useStore } from 'react-hookstore'

import api from '../../api/api'
import { SET_YOUTUBE } from '../../actions/players'

export function YoutubeEmbed(props) {
    const [{ youtube: player }, dispatchPlayers] = useStore('players')
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const { caster, myCaster, youtubeLiveUrl, csrf } = props
    const youtubeId = youtubeLiveUrl ? youtubeLiveUrl.split('?v=')[1] : undefined

    const updateYoutubeUrl = () => {
        api.caster.update({ youtube_url: youtubeUrl }, props.csrf).then(() => {
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
                },
            })
            dispatchPlayers({
                type: SET_YOUTUBE,
                player: new_player,
            })
        }
    }, [youtubeId, dispatchPlayers])

    // set player on load
    useEffect(() => {
        window.YT.ready(createPlayer)
    }, [createPlayer])

    return (
        <>
            <div id="ytplayer"></div>
            <div>
                {myCaster.url_path === caster && (
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
                {myCaster.url_path !== caster && (
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
