import React, { useEffect, useState } from 'react'
import supabase from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const EditProfile = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth')
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('username, email')
                .eq('uid', user.id)   // <- uid
                .single();

            if (error && error.code !== "PGRST116") {
                toast.error(error.message)
                console.log(error.message)
            }

            if (data) {
                setUsername(data.username || "");
                setEmail(data.email || user.email)
            } else {
                setEmail(user.email)
            }
            setLoading(false)
        }
        loadProfile()
    }, [navigate])

    const saveProfile = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setLoading(false)
            return
        }

        const { error } = await supabase
            .from('profiles')
            .upsert({ uid: user.id, username, email }) // <- uid

        if (error) {
            toast.error(error.message)
            console.log(error.message)
        } else {
            toast.success('Profile saved!')
            navigate('/profile')
        }
        setLoading(false)
    }

    if (loading) return <p>Loading...</p>

    return (
        <>
            <div>
                <h1>Edit Profile</h1>

                <input
                    type="text"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button onClick={saveProfile}>Save Profile</button>
            </div>
        </>
    )
}

export default EditProfile