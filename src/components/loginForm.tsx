"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "../styles/login.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showCookiesModal, setShowCookiesModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptCookies, setAcceptCookies] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (email) {
        try {
          const res = await fetch(`/api/mongouser/${email}`);
          if (!res.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await res.json();

          // Populate fields with fetched data
          setEmail(data.email);
          setPassword(""); // Leave password blank for security reasons
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchUserData();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials");
        return;
      }

      // Set session duration based on cookie acceptance
      if (acceptCookies) {
        // Example: set cookie for 30 days
        document.cookie =
          "next-auth.session-token; Max-Age=2592000; Path=/; Secure; SameSite=Lax;";
      } else {
        // Session cookie will expire on logout
        document.cookie =
          "next-auth.session-token; Max-Age=0; Path=/; Secure; SameSite=Lax;";
      }

      router.replace("/");
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleAcceptCookies = () => {
    setAcceptCookies(true);
    setShowCookiesModal(false);
  };

  const handleDeclineCookies = () => {
    setAcceptCookies(false);
    setShowCookiesModal(false);
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <h1>CHRISTMAS SHOP</h1>
        <h1>Login.</h1>
        <input
          type="email"
          placeholder="E-mailaddres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
        <Link href="../signup">
          <h6>
            Don&apos;t have an account? <span className="blue-link">Register</span>
          </h6>
        </Link>
      </form>

      <div className="policy-login">
        <button
          onClick={() => setShowCookiesModal(true)}
          className="cookies-login"
        >
          Cookies
        </button>
        <button onClick={() => setShowTermsModal(true)} className="terms-login">
          Terms
        </button>
      </div>

      {/* Cookies Modal */}
      {showCookiesModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Cookie Policy</h2>
            <p>
              We use cookies to personalize content and ads, to provide social
              media features, and to analyze our traffic. You consent to our
              cookies if you continue to use our website.
            </p>
            <button onClick={handleAcceptCookies}>Accept Cookies</button>
            <button onClick={handleDeclineCookies}>Decline Cookies</button>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Terms and Conditions</h2>
            <p>
              By logging in, you agree to our Terms and Conditions. Make sure
              you read them carefully.
            </p>
            <button onClick={() => setShowTermsModal(false)}>Close</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 5px;
          max-width: 500px;
          width: 100%;
        }
        .modal-content h2 {
          margin-top: 0;
        }
        .modal-content p {
          margin-bottom: 20px;
        }
        .modal-content button {
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}
