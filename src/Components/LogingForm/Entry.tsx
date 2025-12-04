import { Link } from "react-router-dom";
import entryBg from "../assets/entryBg.webp";
import AnimatedPage from "./AnimatedPage";
import { useNavigate } from "react-router-dom";

const Entry = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
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
        <div className="flex flex-col justify-center text-center p-4 md:px-20 md:text-left md:left-0 md:rounded-2xl md:w-[600px] md:bg-gray-250 md:border-1 md:border-gray-200 md:h-[525px]">
          <div className="mb-5">
            <div>
              <h1 className="text-4xl font-bold fontFamily 'Poppins', sans-serif">
                Welcome!
              </h1>
            </div>
            <p className="mt-4 md:text-sm md:mb-1">
              Organic Mind helps you stay focused, organized, and stress-free.
              Simple tools, clean design — everything you need to plan your day
              and achieve your goals.
            </p>
          </div>
          <div>
            <button
              className="bg-[#faf700] text-black px-33 md:px-43 py-2 rounded-lg hover:bg-[#04AA6D] hover:text-white transition duration-300 font-semibold select-none"
              onClick={handleSignup}
            >
              Get Started
            </button>
            <p className="mt-3 font-semibold text-center select-none">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-[#04AA6D] hover:text-gray-800 "
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </AnimatedPage>
    </div>
  );
};

export default Entry;
