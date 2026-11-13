import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signinThunk } from "../Thunks/userThunk";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const user = useSelector((state) => state.signin.data?.user);
  console.log(user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [vibrate, setVibrate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Show buttons when email is not verified
  const [showVerifyButton, setShowVerifyButton] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =========================
  // SIGN IN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setShowVerifyButton(false);

    try {
      const loggedUser = await dispatch(
        signinThunk({
          email,
          password,
        }),
      ).unwrap();
      console.log("loggedUser====>", loggedUser);

      if (loggedUser?.user?.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("Signin failed:", error);

      // Shake animation
      setVibrate(true);

      setTimeout(() => {
        setVibrate(false);
      }, 300);

      // Show ANY error coming from backend
      setErrorMessage(
        error?.message ||
          error?.msg ||
          error?.error ||
          "Something went wrong. Please try again.",
      );

      // 403 = Email not verified
      if (error?.status === 403) {
        setShowVerifyButton(true);
      }
    }
  };

  // =========================
  // GO TO VERIFY EMAIL
  // =========================

  const handleGoToVerify = () => {
    // Send email through URL so VerifyEmail page can use it
    navigate(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  useEffect(() => {
    dispatch(signinThunk());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 pt-2">
      <div className="w-full max-w-md">
        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to your account to continue
          </p>
        </div>

        {/* =========================
            CARD
        ========================= */}

        <div
          className={`${
            vibrate ? "animate-[vibrate_0.25s_ease-in-out]" : ""
          } rounded-2xl border border-gray-200 bg-white p-3 shadow-xl shadow-gray-200/50 sm:p-8`}
        >
          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* =========================
                EMAIL
            ========================= */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  setErrorMessage("");
                  setShowVerifyButton(false);
                }}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* =========================
                PASSWORD
            ========================= */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  setErrorMessage("");
                  setShowVerifyButton(false);
                }}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* =========================
                ALL BACKEND ERRORS
            ========================= */}

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-start gap-3">
                  {/* Error Icon */}

                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    !
                  </div>

                  {/* Backend Error */}

                  <p className="text-sm font-medium leading-6 text-red-600">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            {/* =========================
                EMAIL NOT VERIFIED
            ========================= */}

            {showVerifyButton && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                <p className="mb-3 text-center text-sm font-medium text-orange-700">
                  Your email has not been verified yet.
                </p>

                <button
                  type="button"
                  onClick={handleGoToVerify}
                  className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-gray-800 active:scale-[0.98]"
                >
                  Go to Verify Email
                </button>
              </div>
            )}

            {/* =========================
                REMEMBER ME
            ========================= */}

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 accent-black"
              />

              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>

            {/* =========================
                SIGN IN BUTTON
            ========================= */}

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-4 py-3.5 font-semibold text-white shadow-lg transition duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          {/* =========================
              OR
          ========================= */}

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs text-gray-400">OR</span>

            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* =========================
              SIGNUP
          ========================= */}

          <p className="mt-7 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-semibold text-black hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 Your Store. All rights reserved.
        </p>
      </div>
    </div>
  );
}
