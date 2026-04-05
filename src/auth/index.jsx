import { useState } from "react";
import supabase from "../supabaseClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) navigate("/");
  };
  checkAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignin, setIsSignin] = useState(false);
  const [loading, setLoading] = useState(false);

  async function authFunc() {
    if (email === "" || password === "") {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    if (isSignin) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) toast.error(error.message);
      else {
        toast.success("Registration successful");
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Login successful");
        navigate("/");
      }
    }
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>{isSignin ? "Create Account" : "Welcome Back"}</h1>
        <p style={{ textAlign: "center", marginBottom: "10px" }}>
          {isSignin ? "Sign up to get started" : "Sign in to continue"}
        </p>
        <input
          type="email"
          placeholder="Email address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button onClick={authFunc} disabled={loading}>
          {loading ? "Processing..." : isSignin ? "Sign Up" : "Log In"}
        </button>
        <p className="toggle-text" onClick={() => setIsSignin(!isSignin)}>
          {isSignin ? "Already have an account? " : "Don't have an account? "}
          <span>{isSignin ? "Log In" : "Sign Up"}</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
