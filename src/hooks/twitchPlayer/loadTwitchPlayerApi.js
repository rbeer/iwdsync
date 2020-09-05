export const EMBED_URL = 'https://player.twitch.tv/js/embed/v1.js'

const loadPlayerApi = (callback) => {
    const script = document.createElement('script')

    script.setAttribute('src', EMBED_URL)
    // Wait for DOM to finishing loading before we try loading embed
    script.addEventListener('load', callback)
    document.body.appendChild(script)
}

export default loadPlayerApi
