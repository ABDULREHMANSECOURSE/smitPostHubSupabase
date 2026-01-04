import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../supabaseClient'
import { toast } from 'react-toastify'
const Profile = () => {
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState(' ')
    const [email, setEmail] = useState(' ')
    const navigate = useNavigate()

    useEffect(() => {
        const showPrifile = async () => {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                navigate('/auth')
            }
            const { data, error } = await supabase
                .from('profiles')
                .select('email, username')
                .eq('uid', user.id)
                .single()

            if (error) {
                setLoading(false)
                toast.error('Create profile before look')
                navigate('/profile/edit')
            } else if (!data) {
                setLoading(false)
            }

            if (data.username) setUsername(data.username)
            if (data.email) setEmail(data.email)
            setLoading(false)
        }
        showPrifile()
    }, [navigate])
    if (loading) return <p>Loading...</p>
    return (
        <>
            <h1>Email: {email}</h1>
            <h1>Username: {username}</h1>
            <button onClick={() => navigate('/profile/edit')}>edit profile</button>
            <button onClick={() => navigate('/')}>Home</button>
        </>
    )
}

export default Profile