export const TOGGLE_CHAT = Symbol('TOGGLE_CHAT')
export const POSITION_TWITCH_EMBED = Symbol('POSITION_TWITCH_EMBED')
export const TOGGLE_ABOVE_CHAT = Symbol('TOGGLE_ABOVE_CHAT')
export const TOGGLE_DROPZONE = Symbol('TOGGLE_DROPZONE')

export const symbols = {
    TOGGLE_CHAT,
    POSITION_TWITCH_EMBED,
    TOGGLE_ABOVE_CHAT,
    TOGGLE_DROPZONE,
}

export const actions = {
    [TOGGLE_CHAT]: (state, { channelTag, casterChannelTag, active }) => {
        if (channelTag === casterChannelTag) {
            return {
                ...state,
                chats: { ...state.chats, caster: !state.chats.caster },
            }
        }

        return {
            ...state,
            chats: { ...state.chats, side: !active ? channelTag : '' },
        }
    },
    [POSITION_TWITCH_EMBED]: (state, { translate, size }) => {
        return {
            ...state,
            twitchEmbed: {
                ...state.twitchEmbed,
                translate,
                size,
            },
        }
    },
    [TOGGLE_ABOVE_CHAT]: (state, { aboveChat }) => {
        return {
            ...state,
            twitchEmbed: {
                ...state.twitchEmbed,
                aboveChat,
            },
        }
    },
    [TOGGLE_DROPZONE]: (state, { showDropzone }) => {
        return {
            ...state,
            showDropzone,
        }
    },
}

export default { symbols, actions }
