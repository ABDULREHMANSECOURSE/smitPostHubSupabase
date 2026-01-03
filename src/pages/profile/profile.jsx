import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../supabaseClient'
import { toast } from 'react-toastify'
const Profile = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const showPrifile = async () => {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            const { data, error } = await supabase
                .from('profiles')
                .select('email, username')
                .eq('uid', user.id)
                .single()

            if (error) {
                setLoading(false)
                toast.error(error.message)
            } else if (!data) {
                setLoading(false)
                navigate('/profile/edit')
            }

            setEmail(data.email)
            setUsername(data.username)
            setLoading(false)
        }
        showPrifile()
    }, [navigate])
    if (loading) return <p>Loading...</p>
    return (
        <>
            <h1>Email: {email}</h1>
            <h1>Username:{username}</h1>
            <button onClick={() => navigate('/profile/edit')}>edit profile</button>
            <button onClick={() => navigate('/')}>Home</button>
        </>
    )
}

export default Profile