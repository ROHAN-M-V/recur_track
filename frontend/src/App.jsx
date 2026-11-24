import { useState } from "react";

export default function App() {
  // 1. REACT STATE: This is our app's memory holding our subscription list
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: "Netflix",
      cost: 20,
      cycle: "Monthly",
      category: "Entertainment",
      renewalDate: "2026-11-28",
      status: "Active",
    },
    {
      id: 2,
      name: "Spotify",
      cost: 10,
      cycle: "Monthly",
      category: "Entertainment",
      renewalDate: "2026-12-05",
      status: "Active",
    },
    {
      id: 3,
      name: "GitHub Pro",
      cost: 5,
      cycle: "Monthly",
      category: "Development",
      renewalDate: "2026-12-10",
      status: "Active",
    },
    {
      id: 4,
      name: "Amazon Prime",
      cost: 120,
      cycle: "Yearly",
      category: "Shopping",
      renewalDate: "2027-03-15",
      status: "Active",
    },
  ]);

  // 2. DYNAMIC CALCULATIONS: React recalculates these automatically if subscriptions change!

  // Calculate total monthly spend (if it's yearly, we divide by 12)
  const totalMonthlySpend = subscriptions.reduce((total, sub) => {
    if (sub.cycle === "Yearly") {
      return total + sub.cost / 12;
    }
    return total + sub.cost;
  }, 0);

  // Count active subscriptions
  const activeCount = subscriptions.filter((sub) => sub.status === "Active").length;
  // Handle deleting a subscription by its ID
  const handleDelete = (idToDelete) => {
    // We create a new list that keeps everything EXCEPT the one we want to delete
    setSubscriptions(subscriptions.filter((sub) => sub.id !== idToDelete));
  };
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER SECTION */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-sky-400 tracking-tight">
              Subscription Tracker
            </h1>
            <p className="text-zinc-400 mt-1 text-sm">
              Keep track of your recurring expenses and upcoming renewals.
            </p>
          </div>

          <button className="bg-sky-400 hover:bg-sky-300 text-zinc-950 font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-200 cursor-pointer">
            + Add Subscription
          </button>
        </header>

        {/* METRIC SUMMARY CARDS (Now completely dynamic!) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

          {/* Card 1: Dynamic Total Monthly Spend */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5 backdrop-blur-sm">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Total Monthly Spend
            </span>
            {/* NOTICE THE CURLY BRACES: Pure JavaScript math running inside JSX! */}
            <div className="text-3xl font-bold text-white mt-2">
              ${totalMonthlySpend.toFixed(2)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Normalized to monthly cost
            </p>
          </div>

          {/* Card 2: Dynamic Active Count */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5 backdrop-blur-sm">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Active Subscriptions
            </span>
            <div className="text-3xl font-bold text-white mt-2">
              {activeCount} Active
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Currently being billed
            </p>
          </div>

          {/* Card 3: Next Due */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5 backdrop-blur-sm">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Next Upcoming Bill
            </span>
            <div className="text-3xl font-bold text-sky-400 mt-2">
              {subscriptions[0]?.name || "None"}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Due on {subscriptions[0]?.renewalDate}
            </p>
          </div>

        </section>

        {/* ================= 3. SUBSCRIPTION LIST ================= */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Your Subscriptions</h2>

          <div className="space-y-3">
            {/* REACT MAP LOOP: We loop through each subscription in our state */}
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-4 bg-zinc-800/40 border border-zinc-700/40 hover:border-zinc-600 rounded-xl transition-all"
              >
                {/* Left side: Name & Category */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-lg">
                    {sub.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{sub.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-md">
                        {sub.category}
                      </span>
                      <span className="text-xs text-zinc-400">
                        Renews {sub.renewalDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Price & Billing Frequency */}
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    ${sub.cost.toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-400">
                    per {sub.cycle.toLowerCase()}
                  </div>
                </div>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(sub.id)}
                  className="text-zinc-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer ml-3 text-sm"
                  title="Delete subscription"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}