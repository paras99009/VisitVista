import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

type CommentType = {
  id: string;
  userId: string;
  text: string;
  time: number;
};

type RequestType = {
  id: string;
  place: string;
  vibe: string;
  description: string;
  maxPeople: number;
  joined: string[]; // array of userIds
  createdAt: number;
  whatsapp: string;
  creatorId: string;
  comments: CommentType[];
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [place, setPlace] = useState("");
  const [vibe, setVibe] = useState("");
  const [description, setDescription] = useState("");
  const [maxPeople, setMaxPeople] = useState(2);

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  // Generate unique user ID if not present
  useEffect(() => {
    let uid = localStorage.getItem("userId");
    if (!uid) {
      uid = uuidv4();
      localStorage.setItem("userId", uid);
    }
  }, []);
  const userId = localStorage.getItem("userId") || "";

  // Load requests from storage & fix any old data format
  useEffect(() => {
    const saved = localStorage.getItem("requests");
    if (saved) {
      const parsed: any[] = JSON.parse(saved);
      const fixed = parsed.map((r) => ({
        ...r,
        joined: Array.isArray(r.joined) ? r.joined : [],
        comments: r.comments || []
      }));
      setRequests(fixed);
      localStorage.setItem("requests", JSON.stringify(fixed));
    }
  }, []);

  const saveRequests = (data: RequestType[]) => {
    setRequests(data);
    localStorage.setItem("requests", JSON.stringify(data));
  };

  const createRequest = () => {
    if (!place.trim()) return;

    const newReq: RequestType = {
      id: uuidv4(),
      place,
      vibe,
      description,
      maxPeople,
      whatsapp: whatsappNumber ? `https://wa.me/91${whatsappNumber}` : "",
      createdAt: Date.now(),
      creatorId: userId,
      joined: [],
      comments: []
    };

    saveRequests([newReq, ...requests]);

    setPlace("");
    setVibe("");
    setDescription("");
    setMaxPeople(2);
    setWhatsappNumber("");
    setShowModal(false);
  };

  const joinRequest = (id: string) => {
    const updated = requests.map((r) =>
      r.id === id && r.joined.length < r.maxPeople && !r.joined.includes(userId)
        ? { ...r, joined: [...r.joined, userId] }
        : r
    );
    saveRequests(updated);
  };

  const deleteRequest = (id: string) => {
    saveRequests(requests.filter((r) => r.id !== id));
  };

  const addComment = (id: string) => {
    const text = commentInputs[id]?.trim();
    if (!text) return;

    const updated = requests.map((r) =>
      r.id === id
        ? { ...r, comments: [...r.comments, { id: uuidv4(), userId, text, time: Date.now() }] }
        : r
    );
    saveRequests(updated);
    setCommentInputs({ ...commentInputs, [id]: "" });
  };

  const timeAgo = (t: number) => {
    const diff = Math.floor((Date.now() - t) / 60000);
    if (diff < 1) return "just now";
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* Input trigger */}
      <div className="flex items-center gap-3 bg-[#171717] border border-purple-600 px-4 py-3 rounded-xl shadow-lg">
        <input
          onClick={() => setShowModal(true)}
          placeholder="Create a request..."
          className="w-full bg-transparent outline-none"
        />
        <button onClick={() => setShowModal(true)} className="text-purple-400 text-xl">➤</button>
      </div>

      <div className="mt-8 space-y-6">
        {requests.map((r) => {
          const joined = r.joined.includes(userId);
          const full = r.joined.length >= r.maxPeople;

          return (
            <div key={r.id} className="bg-[#111] border border-purple-700 p-5 rounded-2xl shadow-md hover:scale-[1.01] transition">
              <h2 className="text-xl font-semibold text-purple-400">{r.place}</h2>
              <p className="text-sm text-purple-300">Vibe: {r.vibe}</p>
              <p className="mt-2 text-gray-300">{r.description}</p>

              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-gray-400">{timeAgo(r.createdAt)}</span>
                <span className="text-gray-400">Joined: {r.joined.length}/{r.maxPeople}</span>
              </div>

              <div className="flex gap-3 mt-4">
                {joined && r.whatsapp && (
                  <a href={r.whatsapp} target="_blank" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition">
                    Chat on WhatsApp
                  </a>
                )}

                {!joined && !full && (
                  <button onClick={() => joinRequest(r.id)} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition">
                    Join
                  </button>
                )}

                {full && !joined && <span className="text-gray-500">Full</span>}

                {r.creatorId === userId && (
                  <button onClick={() => deleteRequest(r.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition">
                    Delete
                  </button>
                )}
              </div>

              {/* Comments */}
              <div className="mt-5">
                <h3 className="text-sm text-purple-400 mb-2">Comments</h3>

                {r.comments.map((c) => (
                  <p key={c.id} className="text-gray-300 text-sm border-l border-purple-700 pl-3 my-1">
                    {c.text} <span className="text-gray-500 text-xs ml-2">{timeAgo(c.time)}</span>
                  </p>
                ))}

                <div className="flex gap-2 mt-3">
                  <input
                    value={commentInputs[r.id] || ""}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [r.id]: e.target.value })}
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 bg-[#171717] rounded-lg border border-purple-600 outline-none"
                  />
                  <button onClick={() => addComment(r.id)} className="bg-purple-600 hover:bg-purple-700 px-3 rounded-lg">
                    Send
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#0F0F0F] p-6 w-full max-w-lg border border-purple-700 rounded-xl space-y-3 animate-[fadeIn_0.2s]">
            <h2 className="text-xl font-semibold text-purple-400">Create Request</h2>

            <input value={place} onChange={e => setPlace(e.target.value)} placeholder="Place" className="w-full px-3 py-2 bg-black border border-purple-600 rounded-xl" />
            <input value={vibe} onChange={e => setVibe(e.target.value)} placeholder="Vibe / Mood" className="w-full px-3 py-2 bg-black border border-purple-600 rounded-xl" />
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description..." className="w-full px-3 py-2 h-20 bg-black border border-purple-600 rounded-xl" />

            <input type="number" value={maxPeople} onChange={e => setMaxPeople(Number(e.target.value))} className="w-full px-3 py-2 bg-black border border-purple-600 rounded-xl" placeholder="Max People" />

            {/* WhatsApp Number Input */}
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="WhatsApp Number (optional)"
              className="w-full px-3 py-2 bg-black border border-purple-600 rounded-xl"
              maxLength={10}
            />

            <div className="flex gap-3 mt-4">
              <button onClick={createRequest} className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl">Post</button>
              <button onClick={() => setShowModal(false)} className="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
