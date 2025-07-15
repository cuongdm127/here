"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Heart, Smile } from "lucide-react";

interface EnvelopeResponse {
  content: string;
  emotion?: string;
}
interface Announcement {
  id: string;
  nickname: string;
}

export default function HomePage() {
  const [randomMsg, setRandomMsg] = useState<EnvelopeResponse | null>(null);
  const [loadingRandom, setLoadingRandom] = useState(true);

  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [emotion, setEmotion] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnn, setLoadingAnn] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/envelope", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setRandomMsg(data))
      .catch(() => setRandomMsg(null))
      .finally(() => setLoadingRandom(false));

    fetch("/api/messages/announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoadingAnn(false));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !content.trim()) {
      setError("Vui lòng nhập tên và tin nhắn.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      // POST new message
      const resPost = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          content,
          emotion: emotion || undefined,
        }),
      });

      // handle moderation error
      if (resPost.status === 400) {
        const errData = await resPost.json();
        console.log(errData)
        if (errData.error === "Content is not good!") {
          setError("Nào! Hãy chỉ gửi những điều đẹp đẽ thôi nha!");
        } else {
          setError("Gửi thất bại, vui lòng thử lại.");
        }
        setSending(false);
        return;
      }

      // handle other errors
      if (!resPost.ok) {
        setError("Gửi thất bại, vui lòng thử lại.");
        setSending(false);
        return;
      }

      // refresh announcements
      const resAnn = await fetch("/api/messages/announcements");
      setAnnouncements(await resAnn.json());

      // reset form
      setNickname("");
      setContent("");
      setEmotion("");
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError("Gửi thất bại, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4e6cd] py-12">
      <div className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-12">
        {/* Left column: Greeting, Random Message, Prompt/Form */}
        <div className="flex-1 space-y-12">
          <section className="text-center space-y-6">
            <h1 className="text-4xl font-sans text-gray-800">
              I am here!{" "}
              <Smile className="inline-block w-8 h-8 text-yellow-500 animate-pulse" />
            </h1>
            {loadingRandom ? (
              <p className="italic text-gray-600">Đang tải lời nhắn…</p>
            ) : randomMsg ? (
              <Card className="mt-4 border-l-4 border-[#888151] bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  <Heart className="w-6 h-6 text-[#888151] mt-1" />
                  <div>
                    <p className="text-lg text-gray-700">{randomMsg.content}</p>
                    {randomMsg.emotion && (
                      <p className="text-sm text-gray-500 mt-1">
                        #{randomMsg.emotion}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <p className="italic text-gray-600">Không có lời nhắn nào.</p>
            )}
          </section>

          {!showForm ? (
            <section className="text-center space-y-4">
              <p className="text-lg text-gray-800">
                Bạn có muốn gửi một lời dễ thương đến ai đó ngoài kia đang cần
                không?
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-[#888151] text-white rounded-full hover:bg-[#777041] transition"
              >
                Có ạ
              </button>
            </section>
          ) : (
            <section className="space-y-6">
              <form onSubmit={handleSend} className="space-y-4">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Tên của bạn (ví dụ: Bạn A)"
                  className="w-full border border-[#888151] text-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#888151]"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Trút bầu tâm sự..."
                  className="w-full border border-[#888151] text-gray-700 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#888151]"
                />
                <input
                  type="text"
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  placeholder="#emotion (tùy chọn)"
                  className="w-full border border-[#888151] text-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#888151]"
                />
                {error && <p className="text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 bg-[#888151] text-white rounded-full hover:bg-[#777041] transition disabled:opacity-50"
                >
                  {sending ? "Đang gửi..." : "Gửi tin nhắn yêu thương"}
                </button>
              </form>
            </section>
          )}
        </div>

        {/* Right column: Announcements */}
        <aside className="w-full md:w-1/3">
          <h2 className="text-2xl font-sans text-gray-800 mb-4">
            Gửi gắm niềm an yên
          </h2>
          {loadingAnn ? (
            <p className="text-gray-600">Đang tải hoạt động…</p>
          ) : (
            <ul className="space-y-3">
              {announcements.map((item) => (
                <li key={item.id} className="text-gray-700">
                  <span className="font-semibold text-[#888151]">
                    {item.nickname}
                  </span>{" "}
                  vừa gửi đi một điều đẹp đẽ.
                </li>
              ))}
            </ul>
          )}
          {!loadingAnn && (
            <button className="mt-6 text-[#888151] hover:underline">
              Xem thêm hoạt động
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
