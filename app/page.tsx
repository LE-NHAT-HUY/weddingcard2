"use client";

import { getMessengerLink } from "@/utils/url";

export default function Page() {
  const url = "https://weddingcard-beta.vercel.app/";
  const messengerUrl = getMessengerLink(url);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-4">
      <h1 className="text-4xl font-bold text-pink-700 mb-6">Khánh Nam & Lan Nhi</h1>
      <p className="text-center text-lg mb-8">
        Chúng tôi hân hạnh thông báo lễ cưới của mình! 🎉
      </p>

      {/* Nút chia sẻ Messenger */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(messengerUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition"
      >
        Chia sẻ trên Messenger
      </a>
    </main>
  );
}
