import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../supabaseClient'
import { toast } from 'react-toastify'
import BackToHomeBtn from '../../components/backToHomeBtn'

const Profile = () => {
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState(' ')
    const [email, setEmail] = useState(' ')
    const navigate = useNavigate()

    useEffect(() => {
        const showProfile = async () => {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                navigate('/auth')
                return
            }
            const { data, error } = await supabase
                .from('profiles')
                .select('email, username')
                .eq('uid', user.id)
                .single()

            if (error && error.code !== "PGRST116") {
                toast.error('Please create your profile')
                navigate('/profile/edit')
            }

            if (data?.username) setUsername(data.username)
            if (data?.email) setEmail(data.email)
            else if (user.email) setEmail(user.email)
            
            setLoading(false)
        }
        showProfile()
    }, [navigate])

    if (loading) return <div className="profile-container"><p>Loading profile...</p></div>

    return (
        <div className="profile-container">
            <div className="profile-box" style={{maxWidth: '500px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <BackToHomeBtn />
                    <button className="btn-secondary" onClick={() => navigate('/profile/edit')} style={{padding: '8px 16px', fontSize: '0.9rem'}}>Edit</button>
                </div>
                
                <div style={{textAlign: 'center', marginBottom: '20px'}}>
                    <div style={{width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #8a2be2, #00d4ff)', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', color: '#fff'}}>
                        {username ? username.substring(0, 2).toUpperCase() : 'U'}
                    </div>
                    <h1>My Profile</h1>
                </div>

                <div className="info-row">
                    <span className="info-label">Username</span>
                    <span className="info-value">{username || 'Not set'}</span>
                </div>
                
                <div className="info-row">
                    <span className="info-label">Email Address</span>
                    <span className="info-value">{email}</span>
                </div>
            </div>
        </div>
    )
}

export default Profile