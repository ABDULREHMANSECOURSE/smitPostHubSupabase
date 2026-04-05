import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackToHomeBtn from '../../components/backToHomeBtn';

const AddPost = () => {
    const navigate = useNavigate();

    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingProfile, setCheckingProfile] = useState(true);

    useEffect(() => {
        const checkProfile = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            const userId = sessionData?.session?.user?.id;

            if (!userId) {
                navigate('/auth');
                return;
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('uid')
                .eq('uid', userId)
                .single();

            if (error || !profile) {
                toast.error("Complete your profile to post!");
                navigate('/profile/edit');
            }

            setCheckingProfile(false);
        };

        checkProfile();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content && !imageUrl) {
            toast.error('Post cannot be empty!');
            return;
        }
        setLoading(true);

        const { error } = await supabase
            .from('posts')
            .insert({
                content,
                image_url: imageUrl,
                is_public: true,
            });

        setLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Posted successfully \ud83d\ude80');
            navigate('/');
        }
    };

    if (checkingProfile) return <div className="studio-container"><p>Verifying access...</p></div>;

    return (
        <div className="home-container">
            <BackToHomeBtn />
            <div className="studio-box">
                <h2 style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', margin: '0 0 20px 0'}}>New Post</h2>

                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <div>
                        <textarea
                            placeholder="What's mind-blowing today?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ minHeight: '150px', resize: 'vertical' }}
                        />
                    </div>

                    <div>
                        <input
                            placeholder="Paste an Image URL (optional)"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </div>

                    {imageUrl && (
                        <div style={{marginTop: '10px'}}>
                            <p className="info-label" style={{marginBottom: '10px'}}>Image Preview</p>
                            <img src={imageUrl} alt="Preview" style={{maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', objectFit: 'cover'}} onError={(e) => {e.target.style.display = 'none'; toast.error('Invalid image URL')}} />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || (!content && !imageUrl)}
                        style={{marginTop: '10px', width: '100%', padding: '16px'}}
                    >
                        {loading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPost;
