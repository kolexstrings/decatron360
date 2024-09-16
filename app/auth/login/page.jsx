"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [inspectionData, setInspectionData] = useState(null);

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    if (inspectionData && event.target.value) {
      setInspectionData(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button triggered");
    try {
      const res = await signIn(formData.email, formData.password);
      console.log("login response", res);
      router.replace("/");
    } catch (error) {
      console.error("Issues with login", error);
    }
  };

  const handleRegisterClick = (event) => {
    event.preventDefault();
    router.replace("/auth/register");
  };

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("inspectionData"));
    console.log("Fetched inspection data:", data);
    if (data) {
      setInspectionData(data);
      setFormData((prevState) => ({
        email: prevState.email || data.email || "",
        password: prevState.password || "",
      }));
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-400 focus:border-primary-400 sm:text-sm"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-700" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between">
          <span className="border-t border-gray-300 w-1/3" />
          <span className="text-sm text-gray-500">Or continue with</span>
          <span className="border-t border-gray-300 w-1/3" />
        </div>
        <div>
          <button
            type="button"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 1.9a6.09 6.09 0 016.09 6.09 6.09 6.09 0 01-6.09 6.09 6.09 6.09 0 01-6.09-6.09A6.09 6.09 0 0112 5.9zm0 1.2A4.89 4.89 0 007.11 12 4.89 4.89 0 0012 16.89 4.89 4.89 0 0016.89 12 4.89 4.89 0 0012 7.1zm0 1.2a3.69 3.69 0 013.69 3.69 3.69 3.69 0 01-3.69 3.69 3.69 3.69 0 01-3.69-3.69A3.69 3.69 0 0112 8.3z" />
            </svg>
            Sign in with Google
          </button>
        </div>
        <div className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <a
            href="#"
            className="font-medium text-primary-500 hover:text-primary-400"
            onClick={handleRegisterClick}
          >
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;