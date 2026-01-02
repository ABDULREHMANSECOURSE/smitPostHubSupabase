import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const Navigate = useNavigate()
    Navigate('/auth')
    window.location.href = '/auth'
    return (
        <h1>
            Home
        </h1>
    )
}

export default Home