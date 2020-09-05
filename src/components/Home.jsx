import React from 'react'
import CreateConfig from './CreateConfig'
import UseConfig from './CreateConfig/UseConfig'

export default function Home(props) {
    return (
        <>
            <div>
                <h1 style={{ textAlign: 'center' }}>Quick Multi-stream</h1>
            </div>
            <div style={{ paddingTop: 100, display: 'flex' }}>
                <CreateConfig config={props.config} />
                <UseConfig />
            </div>
        </>
    )
}
