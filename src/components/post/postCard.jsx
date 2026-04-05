import React, { useState, useEffect } from 'react'
import supabase from '../../supabaseClient'

const PostCard = ({ post }) => {
    const [showFull, setShowFull] = useState(false)
    const [likers, setLikers] = useState(post.likers || [])
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id || null)
        })
    }, [])

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

        setLikers(updatedLikers)

        const { error } = await supabase
            .from('posts')
            .update({ likers: updatedLikers })
            .eq('pid', post.pid)

        if (error) {
            console.error('Like update failed:', error)
            setLikers(likers)
        }
    }

    const username = post.profiles?.username || 'Anonymous';
    const initals = username.substring(0, 2).toUpperCase();

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-avatar">{initals}</div>
                <div className="post-username">{username}</div>
            </div>

            <p className="post-content" style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: showFull ? 'none' : 3,
                WebkitBoxOrient: 'vertical'
            }}>
                {post.content}
            </p>

            {post.content?.length > 150 && (
                <button
                    className="see-more-btn"
                    onClick={() => setShowFull(!showFull)}
                >
                    {showFull ? 'Show less' : 'Read more'}
                </button>
            )}

            {post.image_url && (
                <img
                    src={post.image_url}
                    alt="Post media"
                    className="post-image"
                />
            )}

            <div className="post-actions">
                <button
                    onClick={handleLike}
                    className={`like-btn ${liked ? 'liked' : ''}`}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {likes} {likes === 1 ? 'Like' : 'Likes'}
                </button>
            </div>
        </div>
    )
}

export default PostCard
