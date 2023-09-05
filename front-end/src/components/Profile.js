import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  // const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user profile data from localStorage
    const auth = JSON.parse(localStorage.getItem("user"));
    if (auth) {
      setUserName(auth.name);
      setUserEmail(auth.email);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleUpdateProfile = async () => {
    // Prepare the updated profile data
    const updatedProfileData = {
      name: userName,
      email: userEmail,
    };

    // Send a PUT request to the backend API to update the user profile
    try {
      const result = await fetch(`https://e-dashboarddone.vercel.app/:id`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Add any necessary authorization headers here (e.g., token)
        },
        body: JSON.stringify(updatedProfileData),
      });

      const data = await result.json();
      // Handle the response (updated user data) if needed
      console.log("User profile updated:", data);

      // Update the userName in localStorage
      const auth = JSON.parse(localStorage.getItem("user"));
      auth.name = userName;
      localStorage.setItem("user", JSON.stringify(auth));

      setIsEditMode(false); // Switch back to non-edit mode after updating
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handlePasswordReset = async () => {
    // Request OTP for password reset
    try {
      const result = await fetch("https://e-dashboarddone.vercel.app/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await result.json();
      console.log("OTP request response:", data);
      alert("An OTP has been sent to your email for password reset.");
    } catch (error) {
      console.error("Error requesting OTP:", error);
      alert("Failed to send OTP. Please try again later.");
    }
  };

  return (
    <div className="profile">
      <h1>Profile</h1>
      <p>Name: {userName}</p>
      <p>Email: {userEmail}</p>

      {isEditMode ? (
        <div>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={handleUpdateProfile}>Save</button>
          <button onClick={() => setIsEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setIsEditMode(true)}>Edit Profile</button>
      )}

      <button onClick={handlePasswordReset}>Forgot Password</button>
    </div>
  );
};

export default Profile;
