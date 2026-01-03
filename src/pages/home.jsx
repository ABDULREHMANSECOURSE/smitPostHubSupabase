import React, { useEffect } from 'react'
import supabase from '../supabaseClient'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate()
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

    async function profile() {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()

        if (profile) {
            navigate('/profile')
        } else {
            navigate('/profile/edit')
        }
    }

    return (
        <>
            <h1>Home</h1>
            <button onClick={() => profile()}>Profile</button>
            <button onClick={() => logout()}>Logout</button>
        </>
    )
}

export default Home