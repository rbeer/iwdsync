export const SET_TWITCH = Symbol('SET_TWITCH')
export const SET_YOUTUBE = Symbol('SET_YOUTUBE')

export const symbols = {
    SET_TWITCH,
    SET_YOUTUBE,
}

export const actions = {
    [SET_TWITCH]: (state, { player }) => {
        return {
            ...state,
            twitch: player,
        }
    },
    [SET_YOUTUBE]: (state, { player }) => {
        return {
            ...state,
            youtube: player,
        }
    },
}

export default { symbols, actions }
