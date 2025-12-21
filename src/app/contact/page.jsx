export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <p className="text-gray-600 mb-6">
        Reach us anytime and we’ll get back to you.
      </p>

      <form className="space-y-4">
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Your name"
        />
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Your email"
          type="email"
        />
        <textarea
          className="w-full border rounded-lg p-3"
          placeholder="Message"
          rows={5}
        />
        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          Send
        </button>
      </form>
    </div>
  );
}
