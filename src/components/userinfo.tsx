"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import "../styles/UserInfo.css";

interface UserData {
  firstName: string;
  email: string;
  phone: string;
  password: string;
}

export default function UserInfo() {
  const [activeSection, setActiveSection] = useState("account");
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState({ field: "", editing: false });
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    email: "",
    phone: "",
    password: "",
  });

  // Store original data to allow reverting on cancel
  const [originalData, setOriginalData] = useState<UserData>({
    firstName: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user;
      const initialData = {
        firstName: user.firstName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        password: "", // Don't show the password directly
      };
      setUserData(initialData);
      setOriginalData(initialData); // Set original data to the initial state
    }
  }, [session, status]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleEditClick = (field: string) => {
    setIsEditing({ field, editing: true });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userData,
          action: "update",
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        setUserData({
          firstName: updatedUser.user.firstName,
          email: updatedUser.user.email,
          phone: updatedUser.user.phone,
          password: "", // Clear the password field to prevent it from displaying
        });

        // Reset original data after a successful save
        setOriginalData({
          firstName: updatedUser.user.firstName,
          email: updatedUser.user.email,
          phone: updatedUser.user.phone,
          password: "", // Don't store the password
        });

        console.log("User info updated successfully");
      } else {
        console.error("Failed to update user info");
      }

      setIsEditing({ field: "", editing: false });
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const handleCancel = () => {
    // Reset the form fields to their original values
    setUserData(originalData);
    setIsEditing({ field: "", editing: false });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="account-info">
            <h2>Account</h2>
            <div className="info-item">
              <div className="label">Username</div>
              <div className="value">
                {isEditing.editing && isEditing.field === "firstName" ? (
                  <input
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData.firstName}</span>
                )}
                <a href="#" onClick={() => handleEditClick("firstName")}>
                  change
                </a>
              </div>
            </div>
            <div className="info-item">
              <div className="label">E-mail address</div>
              <div className="value">
                {isEditing.editing && isEditing.field === "email" ? (
                  <input
                    type="text"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData.email}</span>
                )}
                <a href="#" onClick={() => handleEditClick("email")}>
                  change
                </a>
              </div>
            </div>
            <div className="info-item">
              <div className="label">Phone number</div>
              <div className="value">
                {isEditing.editing && isEditing.field === "phone" ? (
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{userData.phone}</span>
                )}
                <a href="#" onClick={() => handleEditClick("phone")}>
                  change
                </a>
              </div>
            </div>
            <div className="info-item">
              <div className="label">Password</div>
              <div className="value">
                {isEditing.editing && isEditing.field === "password" ? (
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>********</span>
                )}
                <a href="#" onClick={() => handleEditClick("password")}>
                  change
                </a>
              </div>
            </div>
            {isEditing.editing && (
              <div className="button-group">
                <button onClick={handleSave}>Save</button>
                <button onClick={handleCancel} className="cancel-button">Cancel</button>
              </div>
            )}
          </div>
        );
      case 'shipping':
        return (
          <div className="shipping-info">
            <h2>Shipping Address</h2>
            <div className="info-item">
              <div className="label">Street</div>
              <div className="value">
                Street <a href="#">change</a>
              </div>
            </div>
            <div className="info-item">
              <div className="label">House Number</div>
              <div className="value">
                House number <a href="#">change</a>
              </div>
            </div>
            <div className="info-item">
              <div className="label">Zipcode</div>
              <div className="value">
                Zipcode <a href="#">change</a>
              </div>
            </div>
            <div className="info-item">
              <div className="label">Country</div>
              <div className="value">
                Country <a href="#">change</a>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="order-history">
            <h2>Order History</h2>
            <div className="order-item">
              <div className="product-name">Product name</div>
              <div className="status">Status</div>
            </div>
            <div className="order-item">
              <div className="product-name">Product name</div>
              <div className="status">Status</div>
            </div>
            <div className="order-item">
              <div className="product-name">Product name</div>
              <div className="status">Status</div>
            </div>
          </div>
        );
      case 'language':
        return (
          <div className="language-settings">
            <h2>Language</h2>
            <input type="text" placeholder="Search language" />
          </div>
        );
      case 'support':
        return (
          <div className="contact-support">
            <h2>Contact Support</h2>
            <div className="info-item">
              <div className="label">Subject</div>
              <input type="text" placeholder="Subject" />
            </div>
            <div className="info-item">
              <div className="label">Comment</div>
              <textarea placeholder="Comment"></textarea>
            </div>
            <button>Send</button>
          </div>
        );
      case 'favorites':
        return (
          <div className="favorites">
            <h2>Favorites</h2>
            <div className="favorite-item">
              <div className="product-name">Product name</div>
              <div className="price">Price</div>
            </div>
            <div className="favorite-item">
              <div className="product-name">Product name</div>
              <div className="price">Price</div>
            </div>
            <div className="favorite-item">
              <div className="product-name">Product name</div>
              <div className="price">Price</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="user-info-container">
      <div className="sidebar">
        <div className="icon" onClick={() => setActiveSection('account')}><i className="fi fi-rr-user"></i></div>
        <div className="icon" onClick={() => setActiveSection('shipping')}><i className="fi fi-tr-shipping-fast"></i></div>
        <div className="icon" onClick={() => setActiveSection('orders')}><i className="fi fi-br-time-quarter-past"></i></div>
        <div className="icon" onClick={() => setActiveSection('language')}><i className="fi fi-br-world"></i></div>
        <div className="icon" onClick={() => setActiveSection('support')}><i className="fi fi-ss-comments-question"></i></div>
        <div className="icon" onClick={() => setActiveSection('favorites')}><i className="fi fi-ss-icon-star"></i></div>
      </div>

      <div className="main-content">
            <div className="header">
        <div className="user-summary">
          <p className="username">{userData.firstName}</p> 
          <p className="user-email">{userData.email}</p>
          <p className="user-phone">{userData.phone}</p>
        </div>
        <button className="logout-button" onClick={handleSignOut}>LOGOUT</button>
      </div>
        {renderContent()}
      </div>
    </div>
  );
}

function setUserData(data: any) {
  throw new Error('Function not implemented.');
}
