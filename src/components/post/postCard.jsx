import React, { useState, useEffect } from 'react'
import supabase from '../../supabaseClient'

const PostCard = ({ post }) => {
    const [showFull, setShowFull] = useState(false)
    const [likers, setLikers] = useState(post.likers || [])
    const [userId, setUserId] = useState(null)

    // 🔹 Get current user
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null)
        })
    }, [])

    // 🔥 LIVE UPDATE (Realtime Likes)
    useEffect(() => {
        if (!post?.pid) return

        const channel = supabase
            .channel(`post-likes-${post.pid}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'posts',
                    filter: `pid=eq.${post.pid}`
                },
                (payload) => {
                    setLikers(payload.new.likers || [])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [post.pid])

    const liked = userId ? likers.includes(userId) : false
    const likes = likers.length

    const handleLike = async () => {
        if (!userId || !post?.pid) return

        const updatedLikers = liked
            ? likers.filter(id => id !== userId)
            : [...likers, userId]

        // ⚡ instant UI
        setLikers(updatedLikers)

        const { error } = await supabase
            .from('posts')
            .update({ likers: updatedLikers })
            .eq('pid', post.pid)

        if (error) {
            console.error('Like update failed:', error)
            // rollback if error
            setLikers(likers)
        }
    }

    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '15px',
            margin: '10px auto',
            maxWidth: '600px',
            background: '#fff'
        }}>
            <h4>{post.profiles?.username || 'Anonymous'}</h4>

            {post.image_url && (
                <img
                    src={post.image_url}
                    alt=""
                    style={{
                        width: '100%',
                        borderRadius: '10px',
                        marginTop: '10px'
                    }}
                />
            )}

            <p style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: showFull ? 'none' : 2,
                WebkitBoxOrient: 'vertical'
            }}>
                {post.content}
            </p>

            {post.content?.length > 100 && (
                <button
                    style={{
                        border: 'none',
                        background: 'none',
                        color: '#1877f2',
                        cursor: 'pointer'
                    }}
                    onClick={() => setShowFull(!showFull)}
                >
                    {showFull ? 'See less' : 'See more'}
                </button>
            )}

            <div style={{ marginTop: '10px' }}>
                <button
                    onClick={handleLike}
                    style={{
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: liked ? '#1877f2' : '#eee',
                        color: liked ? '#fff' : '#000',
                        cursor: 'pointer'
                    }}
                >
                    👍 {likes}
                </button>
            </div>
        </div>
    )
}

export default PostCard
