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

    if (loading) return <p>Loading...</p>

    return (
        <>
            <h1>Home</h1>

            <button onClick={() => navigate('/profile')}>Profile</button>
            <button onClick={async () => {
                await supabase.auth.signOut()
                navigate('/auth')
            }}>
                Logout
            </button>
            <button onClick={() => navigate('/studio')}>studio</button>

            {posts.map(post => (
                <PostCard key={post.pid} post={post} />
            ))}
        </>
    )
}

export default Home
