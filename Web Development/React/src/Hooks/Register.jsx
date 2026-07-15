import React, { useState } from "react";
import "./Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitted(true);
            setErrors({});
        } else {
            setErrors(validationErrors);
            setIsSubmitted(false);
        }
    };

    const handleReset = () => {
        setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        });
        setErrors({});
        setIsSubmitted(false);
    };

    return (
        <div className="register-card">
            <h2 className="register-title">📝 Create Account</h2>
            <p className="register-text">Join us today! Enter your details below.</p>
            
            {isSubmitted ? (
                <div className="register-summary">
                    <h3 style={{ color: "#22d3ee", marginBottom: "15px" }}>🎉 Success!</h3>
                    <p>Welcome, <strong>{formData.username}</strong>!</p>
                    <p style={{ fontSize: "0.9rem", margin: "10px 0 20px" }}>Email: {formData.email}</p>
                    <button className="register-button" onClick={handleReset}>Register Another</button>
                </div>
            ) : (
                <form className="register-form" onSubmit={handleSubmit}>
                    <div>
                        <label className="register-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="register-input"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                        />
                        {errors.username && <p className="register-error">{errors.username}</p>}
                    </div>

                    <div>
                        <label className="register-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="register-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@example.com"
                        />
                        {errors.email && <p className="register-error">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="register-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="register-input"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="register-error">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="register-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="register-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="register-error">{errors.confirmPassword}</p>}
                    </div>

                    <button type="submit" className="register-button">Sign Up</button>
                </form>
            )}
        </div>
    );
};

export default Register;