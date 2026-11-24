export default function Contact() {
  return (
    <div className=" overflow-hidden bg-gray-100 px-4 lg:ms-40 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-center">
        {/* Heading */}
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Contact Us
          </h1>

          <p className="mx-auto  max-w-2xl text-sm text-gray-600 sm:text-base">
            Have a question or need help? We'd love to hear from you. Send us a
            message and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-5 shadow-lg sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Send us a message
          </h2>

          <form className="mt-4 space-y-3">
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
                rows="3"
                placeholder="Write your message..."
                className="mt-1 block w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
