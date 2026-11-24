import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = String(formData.get("subject") || "").trim();
    const body = [
      `Name: ${String(formData.get("name") || "").trim()}`,
      `Email: ${String(formData.get("email") || "").trim()}`,
      "",
      String(formData.get("message") || "").trim(),
    ].join("\n");

    window.location.href = `mailto:support@shopnest.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <div className="min-h-[65vh] overflow-hidden bg-slate-50 px-4 py-10 lg:ml-64 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col justify-center">
        {/* Heading */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Contact Us
          </h1>

          <p className="mx-auto  max-w-2xl text-sm text-gray-600 sm:text-base">
            Have a question or need help? We'd love to hear from you. Send us a
            message and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Send us a message
          </h2>
          {submitted && (
            <p role="status" className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              Your email app should open with the message ready to send.
            </p>
          )}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            {/* Name + Email */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Enter your name"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>

              <input
                type="text"
                id="subject"
                name="subject"
                required
                placeholder="What is this about?"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="3"
                required
                placeholder="Write your message..."
                className="mt-1 block w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 sm:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
