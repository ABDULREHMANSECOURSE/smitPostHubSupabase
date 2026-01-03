import React, { useState } from 'react'
import supabase from '../../supabaseClient'
import { toast } from 'react-toastify'

const PostCard = ({ post }) => {
    const [showFull, setShowFull] = useState(false)
    const [likes, setLikes] = useState(post.likes || 0)
    const [liked, setLiked] = useState(false)

    const handleLike = async () => {
        const newLikes = liked ? likes - 1 : likes + 1
        setLikes(newLikes)
        setLiked(!liked)

        const { error } = await supabase
            .from('posts')
            .update({ likes: newLikes })  // ✅ update field to newLikes
            .eq('pid', post.pid)

        if (error) {
            toast.error(error.message)   // ✅ use error.message
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
            {/* Author */}
            <h4>{post.profiles?.username || 'Anonymous'}</h4>

            {/* Image */}
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

            {/* Content */}
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
                    style={{ border: 'none', background: 'none', color: '#1877f2' }}
                    onClick={() => setShowFull(!showFull)}
                >
                    {showFull ? 'See less' : 'See more'}
                </button>
            )}

            {/* Like */}
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
