import React from "react";
import { Link, useNavigate } from "react-router-dom";
import entryBg from "../assets/entryBg.webp";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import google from "../assets/google.png";
import AnimatedPage from "./AnimatedPage";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../Firebase";

const Signup = () => {
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const user = auth.currentUser;

  if (user) {
    const uid = user.uid;
    console.log("User UID:", uid);
  }

  const navigate = useNavigate();

  // React.useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       navigate("/today");
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [auth, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return (
      password.length >= 6 && /\d/.test(password) && /[a-zA-Z]/.test(password)
    );
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google sign-in success:", user);
      navigate("/today");
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 6 characters long. and contain both letters and numbers."
      );
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });

      console.log("User signed up successfully:", user);
      console.log(user.displayName);

      navigate("/today");
    } catch (error: unknown) {
      const err = error as { code: string; message: string };
      console.error("Error signing up:", err.code, err.message);

      switch (err.code) {
        case "auth/email-already-in-use":
          setError(
            "This email is already registered. Please use a different email or sign in."
          );
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Please use at least 6 characters.");
          break;
        case "auth/network-request-failed":
          setError(
            "Network error. Please check your connection and try again."
          );
          break;
        default:
          setError("An error occurred during sign up. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row overflow-x-hidden w-full items-center justify-center md:pr-4 md:items-center h-screen bg-gray-100 md:gap-6 overflow-hidden">
      <div className="relative hidden md:block rounded-2xl overflow-hidden md:h-[530px] md:w-[620px] md:max-w-[50%]">
        <h1 className="absolute top-4 left-5 text-white text-3xl font-bold z-10">
          Daily Bloom
        </h1>
        <img
          src={entryBg}
          alt="Entry Background"
          className="w-full h-full object-cover max-h-[530px]"
        />
      </div>

      <AnimatedPage>
        <div className="flex flex-col justify-center text-center p-4 md:px-20 md:text-left md:left-0 md:rounded-2xl md:border-1 md:border-gray-200 md:w-[600px] md:bg-gray-250 md:h-[525px]">
          <form onSubmit={handleSignUp}>
            <div className="mb-5">
              <div>
                <h1
                  className="text-4xl font-bold"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Sign Up
                </h1>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-xs">
                  {error}
                </div>
              )}

              <div className="mt-8 md:text-base md:mb-2">
                <div className="flex flex-row md:w-8/9 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border border-gray-300 p-2 md:p-2 rounded-md w-full"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="border border-gray-300 p-2 md:p-2 rounded-md w-full"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  className="border border-gray-300 p-2 md:p-2 md:w-8/9 mt-4 rounded-md w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />

                <div className="flex items-center mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="border border-gray-300 p-2 md:p-2 md:w-8/9 rounded-md w-full mt-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    minLength={6}
                  />
                  <span
                    className="cursor-pointer text-gray-500 hover:text-gray-800 md:text-xl absolute right-4 mt-4 md:right-15 md:mt-4"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                type="button"
                className="bg-white  border-gray-300 text-gray-700 px-27 py-2 rounded-sm shadow-md 
                hover:bg-gray-100 transition cursor-pointer duration-300 font-semibold 
                select-none transform hover:scale-102 flex items-center gap-2 mb-3 mt-10"
              >
                <img src={google} alt="Google" className="w-5 h-5" />
                Sign Up with Google
              </button>
              <button
                type="submit"
                className="bg-[#faf700] text-black mt-4 md:mt-1 px-23 md:px-4 w-[394px] py-2 rounded-lg hover:bg-[#04AA6D] hover:text-white transition duration-300 font-semibold select-none disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

              <p className="mt-3 font-semibold text-center select-none">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-[#04AA6D] hover:text-gray-800"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </AnimatedPage>
    </div>
  );
};

export default Signup;
