import { useState, useLayoutEffect } from 'react'

const getContentBounds = () => {
    const contentElement = document.querySelector('.content')
    const contentRect = contentElement.getBoundingClientRect().toJSON()
    const scrollTop = document.scrollingElement.scrollTop
    return {
        left: 0,
        right: contentRect.right - 1,
        top: contentElement.offsetTop,
        bottom: contentRect.bottom + scrollTop,
    }
}

const useContentBounds = () => {
    const [contentBounds, setContentBounds] = useState(getContentBounds)
    const resizeHandler = () => {
        setContentBounds(getContentBounds)
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', resizeHandler)
        return () => window.removeEventListener('resize', resizeHandler)
    })

    return contentBounds
}

export default useContentBounds
