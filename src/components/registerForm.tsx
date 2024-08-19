"use client";
import Link from "next/link";
import { useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useRouter } from "next/navigation";
import "../styles/login.css";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !password ||
      !email ||
      !phone ||
      !confirmPassword
    ) {
      setError("Please fill in all fields!");
      return;
    }

    const phoneNumber = parsePhoneNumberFromString(phone, "US"); // Replace 'US' with your default country code if necessary
    if (!phoneNumber || !phoneNumber.isValid()) {
      setError("Invalid phone number!");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Invalid e-mail address!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    // Proceed with registration logic here (e.g., send data to the server)
    console.log("Registration data:", {
      firstName,
      lastName,
      password,
      email,
      phone,
    });

    try {
      const resUserExists = await fetch("../api/userExist", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("../api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          password,
          email,
          phone,
        }),
      });

      if (res.ok) {
        // Option 1: Use form.reset() to clear all form fields
        const form = e.target as HTMLFormElement;
        form.reset();

        // Option 2: Manually clear each state (this is useful if form.reset() doesn't work as expected)
        setFirstName("");
        setLastName("");
        setPassword("");
        setEmail("");
        setPhone("");
        setConfirmPassword("");

        const successSignedUp =
          "You have successfully registered and can now log in!";

        router.push(`../success?message=${successSignedUp}`);
      } else {
        console.log("User registration failed");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Christmas Shop</h1>
        <h2>Register.</h2>
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="E-mailadres"
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
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Register</button>
        <Link href={"/login"}>
          ALREADY HAVE AN ACCOUNT? <span className="blue-link">LOGIN</span>
        </Link>
      </form>
    </div>
  );
}
