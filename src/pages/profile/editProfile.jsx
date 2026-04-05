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
                .eq('uid', user.id)
                .single();

            if (error && error.code !== "PGRST116") {
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
            .upsert({ uid: user.id, username, email })

        if (error) {
            toast.error(error.message)
            console.log(error.message)
        } else {
            toast.success('Profile saved!')
            navigate('/profile')
        }
        setLoading(false)
    }

    if (loading) return <div className="profile-container"><p>Loading...</p></div>

    return (
        <div className="profile-container">
            <div className="profile-box" style={{maxWidth: '500px'}}>
                <button className="btn-secondary back-btn" onClick={() => navigate(-1)} style={{padding: '8px 16px', fontSize: '0.9rem'}}>
                    &larr; Back
                </button>
                
                <h1 style={{textAlign: 'left', marginBottom: '20px'}}>Edit Profile</h1>

                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                    <label className="info-label">Display Name</label>
                    <input
                        type="text"
                        placeholder='Enter your username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px'}}>
                    <label className="info-label">Email Address</label>
                    <input
                        type="email"
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                        style={{opacity: 0.6, cursor: 'not-allowed'}}
                    />
                </div>

                <button onClick={saveProfile} disabled={loading || !username.trim()}>
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </div>
    )
}

export default EditProfile