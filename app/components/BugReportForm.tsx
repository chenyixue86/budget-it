"use client";

export default function BugReportForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-white/40 mb-2">
            Naam <span className="text-white/20">(optioneel)</span>
          </label>
          <input
            type="text"
            placeholder="Kevin"
            className="w-full bg-[#111111] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-2">
            Email <span className="text-white/20">(optioneel)</span>
          </label>
          <input
            type="email"
            placeholder="kevin@mail.com"
            className="w-full bg-[#111111] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-white/40 mb-2">Wat ging er mis?</label>
        <textarea
          rows={5}
          placeholder="Beschrijf de bug of je feedback. Wat deed je, wat verwachtte je, wat gebeurde er?"
          className="w-full bg-[#111111] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-green-400/40 transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full text-black font-semibold py-3.5 rounded-xl text-sm"
      >
        Verstuur →
      </button>
    </form>
  );
}
