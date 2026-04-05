import React, { useEffect, useState } from 'react'
import supabase from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'
import PostCard from '../../components/post/postCard'

const Home = () => {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*, profiles(username)')
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error)
        } else {
            setPosts(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) navigate('/auth')
        })
    }, [navigate])

    if (loading) return <div className="home-container" style={{textAlign: 'center', marginTop: '50px'}}><p>Loading Activity...</p></div>

    return (
        <div className="home-container">
            <div className="home-header">
                <h1>PostHub</h1>
                <div className="header-buttons">
                    <button className="btn-secondary" onClick={() => navigate('/studio')}>+ Create</button>
                    <button className="btn-secondary" onClick={() => navigate('/profile')}>Profile</button>
                    <button className="btn-danger" onClick={async () => {
                        await supabase.auth.signOut()
                        navigate('/auth')
                    }}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="posts-feed">
                {posts.map(post => (
                    <PostCard key={post.pid} post={post} />
                ))}
                {posts.length === 0 && <p style={{textAlign: 'center', marginTop: '40px'}}>No posts yet. Be the first to post!</p>}
            </div>
        </div>
    )
}

export default Home
