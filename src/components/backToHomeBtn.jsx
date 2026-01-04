import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackToHomeBtn = () => {
    const navigate = useNavigate()
    return (
        <button onClick={() => navigate('/')}>Back to home</button>
    )
}

export default BackToHomeBtn