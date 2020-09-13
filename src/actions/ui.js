export const TOGGLE_CHAT = Symbol('TOGGLE_CHAT')
export const POSITION_TWITCH_EMBED = Symbol('POSITION_TWITCH_EMBED')
export const TOGGLE_ABOVE_CHAT = Symbol('TOGGLE_ABOVE_CHAT')
export const TOGGLE_DROPZONE = Symbol('TOGGLE_DROPZONE')
export const TOGGLE_PANEL_WITH_VIDEO = Symbol('TOGGLE_PANEL_WITH_VIDEO')

export const symbols = {
    TOGGLE_CHAT,
    POSITION_TWITCH_EMBED,
    TOGGLE_ABOVE_CHAT,
    TOGGLE_DROPZONE,
    TOGGLE_PANEL_WITH_VIDEO,
}

export const actions = {
    [TOGGLE_CHAT]: (state, { channelTag, casterChannelTag, active, isCaster }) => {
        if (isCaster) {
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
    [POSITION_TWITCH_EMBED]: (state, { translate, size }) => ({
        ...state,
        twitchEmbed: {
            ...state.twitchEmbed,
            translate: translate ? translate : state.twitchEmbed.translate,
            size: size ? size : state.twitchEmbed.size,
        },
    }),
    [TOGGLE_ABOVE_CHAT]: (state, { aboveChat }) => ({
        ...state,
        twitchEmbed: {
            ...state.twitchEmbed,
            aboveChat,
        },
    }),
    [TOGGLE_DROPZONE]: (state, { showDropzone }) => ({
        ...state,
        showDropzone,
    }),
    [TOGGLE_PANEL_WITH_VIDEO]: (state, { panelWithVideo }) => ({
        ...state,
        panelWithVideo,
    }),
}

export default { symbols, actions }
