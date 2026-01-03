import { useState } from "react";
import supabase from "../../supabaseClient";

const PostCard = ({ post }) => {
    const [likes, setLikes] = useState(post.likes || 0);
    const [liked, setLiked] = useState(false);

    const handleLike = async () => {
        const newLikes = liked ? likes - 1 : likes + 1;

        setLikes(newLikes);
        setLiked(!liked);

        const { error } = await supabase
            .from("posts")
            .update({ likes: newLikes })
            .eq("pid", post.pid);

        if (error) {
            console.error("Like update failed", error);
        }
    };

    return (
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "10px" }}>
            <h4>@{post.profiles?.username}</h4>

            <p>{post.content}</p>

            {post.image_url && (
                <img
                    style={{ width: "100%", borderRadius: "10px" }}
                    src={post.image_url}
                    alt='image'
                />
            )}

            <button
                onClick={handleLike}
                style={{
                    background: liked ? "#0a66c2" : "#eee",
                    color: liked ? "#fff" : "#000",
                    padding: "8px 15px",
                    borderRadius: "20px",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                👍 {likes}
            </button>
        </div>
    );
};

export default PostCard;
