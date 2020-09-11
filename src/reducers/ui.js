import { actions } from '../actions/ui'

export const initialState = {
    chats: {
        side: '',
        caster: true,
    },
    twitchEmbed: {
        translate: [0, 0],
        size: [225, 400],
        aboveChat: true,
    },
    showDropzone: false,
}

export const reducer = (state, action) => {
    if (actions[action.type]) {
        return actions[action.type](state, action, initialState)
    }
    return initialState
}
