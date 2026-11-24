import { useDispatch } from "react-redux";
import { SignupThunk } from "../Thunks/userThunk";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await dispatch(
        SignupThunk({
          name,
          username,
          email,
          password,
        }),
      ).unwrap();

      navigate("/verify-email", {
        state: {
          email: email,
        },
      });
    } catch (error) {
      setErrorMessage(
        typeof error === "string"
          ? error
          : error?.message || "Signup failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="relative w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-2xl shadow-black/20 sm:p-9">
        {/* Heading */}
        <div className="mb-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Create your account</h1>

          <p className="mt-2 text-sm text-slate-500">
            Join ShopNest and find something you’ll love.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {errorMessage && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
              {errorMessage}
              <span className="mt-2 block">
                Already registered?{" "}
                <Link
                  to="/verify-email"
                  className="font-semibold underline underline-offset-2"
                >
                  Resend verification email
                </Link>
              </span>
            </p>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-orange-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-orange-600/15 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        {/* Signin */}
        <p className="mt-2 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/signin"
            className="font-semibold text-gray-900 hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
