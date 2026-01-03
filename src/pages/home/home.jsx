import React, { useEffect, useState } from 'react'
import supabase from '../../supabaseClient'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PostCard from '../../components/post/postCard';

const Home = () => {
    const navigate = useNavigate()

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetchPosts()
    }, [])
    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select(
                '*,profiles(username)'
            ).order('creater_at', { ascending: false })

        if (error) {
            console.error(error)
        }
    }


    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                navigate('/auth')
            }
        }
        checkAuth();
    }, [navigate])
    async function logout() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            toast.error(error.message);
        } else {
            toast.info('Logout successful');
            navigate('/auth');
        }
    };

    const postsArray = [
        {
            pid: '1',
            authorName: 'Abdul',
            content: 'This is my first post! Hello everyone!                 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi et quam incidunt id, aliquid voluptates, ipsum quod ullam dolor dolore illum at harum dolorum eveniet reiciendis accusamus. Excepturi, repellendus. Officia.',
            image_url: 'https://picsum.photos/1000/1000',
            likes: 5,
            comments: 2
        },
        {
            pid: '2',
            authorName: 'Ali',
            content: 'Short post without image.',
            likes: 0,
            comments: 0
        }
    ];

    return (
        <>
            <h1>Home</h1>
            <button onClick={() => navigate('/profile')
            }>Profile</button>
            <button onClick={() => logout()}>Logout</button>
            <div>
                {postsArray.map(post => (
                    <PostCard key={post.pid} post={post} />
                ))}
            </div>
        </>
    )
}

export default Home