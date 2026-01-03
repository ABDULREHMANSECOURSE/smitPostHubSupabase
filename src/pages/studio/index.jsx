import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddPost = () => {
    const navigate = useNavigate();

    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingProfile, setCheckingProfile] = useState(true); // initially check profile

    useEffect(() => {
        const checkProfile = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            const userId = sessionData?.session?.user?.id;

            if (!userId) {
                // user not logged in
                navigate('/auth');
                return;
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('uid')
                .eq('uid', userId)
                .single();

            if (error || !profile) {
                toast.error("Can't upload anything before completing your profile!");
                navigate('/profile/edit');
            }

            setCheckingProfile(false);
        };

        checkProfile();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content && !imageUrl) return alert('Post cannot be empty!');
        setLoading(true);

        const { error } = await supabase
            .from('posts')
            .insert({
                content,
                image_url: imageUrl,
                is_public: true, // default public post
            });

        setLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Post added!');
            navigate('/'); // go back to feed
        }
    };

    if (checkingProfile) return <p>Checking profile...</p>;

    return (
        <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', background: '#fff' }}>
            <h2>Create Post</h2>

            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ width: '100%', minHeight: '100px', padding: '10px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
                />

                <input
                    placeholder="Image URL (optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '20px',
                        border: 'none',
                        background: '#1877f2',
                        color: '#fff',
                        cursor: 'pointer',
                    }}
                >
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </form>
        </div>
    );
};

export default AddPost;
