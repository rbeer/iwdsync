import { actions } from '../actions/players'

export const initialState = {
    twitch: null,
    youtube: null,
}

export const reducer = (state, action) => {
    if (actions[action.type]) {
        return actions[action.type](state, action, initialState)
    }
    return initialState
}
