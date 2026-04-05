import React from 'react'
import { useNavigate } from 'react-router-dom'

const BackToHomeBtn = () => {
    const navigate = useNavigate()
    return (
        <button 
            className="btn-secondary back-btn" 
            onClick={() => navigate('/')}
            style={{padding: '8px 16px', fontSize: '0.9rem'}}
        >
            &larr; Home
        </button>
    )
}

export default BackToHomeBtn