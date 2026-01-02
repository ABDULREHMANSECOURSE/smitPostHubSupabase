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

    return (
        <>
            <h1>Home</h1>
            <button onClick={() => logout()}>Logout</button>
        </>
    )
}

export default Home