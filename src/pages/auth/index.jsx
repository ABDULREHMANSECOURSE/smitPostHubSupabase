import React, { useState } from 'react'
import supabase from '../../supabaseClient'
import { toast } from 'react-toastify'
const Auth = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignin, setIsSignin] = useState(false)

    async function authFunc() {
        if (email === '' || password === '') {
            toast.error('fill all fields');
            return;
        }
        console.log(email, password)
        if (isSignin) {
            const { data, error } = await supabase.auth.signUp({ email, password })
            console.log(data ? data : error)
            toast.error(error)
            if (error) toast.error(error.message)
            else toast.success('Account Created succesful')
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            console.log(error ? error : data)
            if (error) toast.error(error.message)
            else toast.success('Login succesful')
        }
    }

    return (
        <>
            <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
            <button onClick={authFunc}>{isSignin ? 'Create Account' : 'Login'}</button>
            <p style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => {
                    setIsSignin(isSignin ? false : true);
                    console.log(isSignin);
                }}>{isSignin ? 'Already have an account' : "don't have an account"}</p>
        </>
    )
}

export default Auth