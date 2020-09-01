import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    // Link
} from 'react-router-dom'

import { Caster } from './components/caster'
import './App.css'

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={() => <Redirect to="/viewer/iwd" />} />
                <Route exact path="/:mode(caster|viewer)/:caster" component={Caster} />
            </Switch>
        </Router>
    )
}

export default App
