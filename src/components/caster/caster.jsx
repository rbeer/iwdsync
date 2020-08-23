import React, { useEffect, useState } from 'react'
import { createStore, useStore } from 'react-hookstore'

import api from '../../api/api'
import * as uiStoreParams from '../../reducers/ui'
import * as playersStoreParams from '../../reducers/players'

import Controls from './Controls'
import { TwitchChatEmbed } from './twitchchatembed'
import { YoutubeEmbed } from './youtubeembed'
import { TwitchEmbed } from './twitchembed'
// import { Instructions } from './instructions'
import Footer from '../general/Footer'

const savedState = JSON.parse(window.localStorage.getItem('ui')) || {}
const combinedState = { ...uiStoreParams.initialState, ...savedState }
createStore('ui', combinedState, uiStoreParams.reducer).subscribe((state) => {
    window.localStorage.setItem('ui', JSON.stringify(state))
})

createStore('players', playersStoreParams.initialState, playersStoreParams.reducer)

export function Caster({ match }) {
    const [csrf, setCsrf] = useState('')
    const [casterData, setCasterData] = useState({})
    const [myCaster, setMyCaster] = useState({})
    const [{ chats }] = useStore('ui')

    const mode = match.params.mode
    const caster = match.params.caster

    // get csrf
    useEffect(() => {
        api.caster.getCsrf().then((response) => {
            setCsrf(response.data.data)
        })
    }, [])

    useEffect(() => {
        // gets data for https://stream-sync/caster/{caster}
        const data = { url_path: caster }
        api.caster.get(data).then((response) => {
            setCasterData(response.data.data)
        })

        api.caster.getMyCaster().then((response) => {
            setMyCaster(response.data.data)
        })
    }, [caster])

    return (
        <div className="grid-container">
            <Controls />
            <div className="content">
                <div className="chat" open={chats.side !== ''}>
                    <TwitchChatEmbed channel={chats.side} />
                </div>
                <div className="video">
                    <YoutubeEmbed
                        caster={caster}
                        youtubeLiveUrl={casterData.youtube_url}
                        myCaster={myCaster}
                        csrf={csrf}
                        mode={mode}
                    />
                </div>
                <div className="chat" open={chats.caster}>
                    <TwitchChatEmbed channel={casterData.twitch_channel} />
                </div>
            </div>
            {casterData.twitch_channel && mode === 'viewer' && <TwitchEmbed config={casterData} />}
            <Footer />
        </div>
    )
}
