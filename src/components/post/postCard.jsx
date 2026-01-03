import React, { useState } from 'react';

const PostCard = ({ post }) => {
    const [showFull, setShowFull] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes || 0);
    const [animate, setAnimate] = useState(false);

    const handleLike = () => {
        setAnimate(true);

        if (liked) {
            setLikesCount(likesCount - 1);
        } else {
            setLikesCount(likesCount + 1);
        }

        setLiked(!liked);

        // animation reset
        setTimeout(() => setAnimate(false), 300);
    };

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '15px',
        margin: '10px 10px',
        maxWidth: '600px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        fontFamily: 'sans-serif',
        background: '#fff'
    };

    const contentStyle = {
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: showFull ? 'none' : 2,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        marginTop: '10px'
    };

    const imageStyle = {
        maxWidth: '100%',
        maxHeight: '1000px',
        borderRadius: '10px',
        marginTop: '10px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto'
    };

    const buttonStyle = {
        background: 'none',
        border: 'none',
        color: '#1877f2',
        cursor: 'pointer',
        padding: 0,
        fontSize: '0.9rem',
        marginTop: '5px'
    };

    const likeButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '20px',
        cursor: 'pointer',
        border: '1px solid #ccc',
        background: liked ? '#e7f3ff' : '#f5f5f5',
        color: liked ? '#1877f2' : '#555',
        transform: animate ? 'scale(1.3)' : 'scale(1)',
        transition: 'all 0.2s ease'
    };

    return (
        <div style={cardStyle}>
            {/* Author */}
            <h4 style={{ marginBottom: '5px' }}>
                {post.authorName || 'Anonymous'}
            </h4>

            {/* Image */}
            {post.image_url && (
                <img
                    src={post.image_url}
                    alt="post-image"
                    style={imageStyle}
                />
            )}

            {/* Content */}
            <p style={contentStyle}>{post.content}</p>

            {/* See more / less */}
            {post.content && post.content.length > 100 && (
                <button
                    style={buttonStyle}
                    onClick={() => setShowFull(!showFull)}
                >
                    {showFull ? 'See less' : 'See more'}
                </button>
            )}

            {/* Like button */}
            <div style={{ marginTop: '12px' }}>
                <button style={likeButtonStyle} onClick={handleLike}>
                    👍 {likesCount}
                </button>
            </div>
        </div>
    );
};

export default PostCard;
