import { useState, useEffect } from "react";

export default function App() {
  // 1. REACT STATE: This is our app's memory holding our subscription list
  const [subscriptions, setSubscriptions] = useState([]);
  // Tracks if the popup modal is visible or hidden
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Holds the temporary data the user types into the form
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
    cycle: "Monthly",
    category: "Entertainment",
    renewalDate: "",
  });
  // Base URL of our running FastAPI backend
  const API_URL = "http://127.0.0.1:8000/subscriptions";

  // Function to fetch subscriptions from the database
  const fetchSubscriptions = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      } else {
        console.error("Failed to fetch subscriptions");
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  // Run once when the page loads
  useEffect(() => {
    fetchSubscriptions();
  }, []);
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
  // Handle deleting a subscription by sending a DELETE request to FastAPI
  const handleDelete = async (idToDelete) => {
    try {
      const response = await fetch(`${API_URL}/${idToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // If the database successfully deleted it, remove it from React screen!
        setSubscriptions(subscriptions.filter((sub) => sub.id !== idToDelete));
      } else {
        console.error("Failed to delete from database");
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };
  // Handle adding a new subscription by sending a POST request to FastAPI
  const handleAddSubscription = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.cost) return;

    // The payload matching our backend's SubscriptionCreate schema
    const newSubscriptionPayload = {
      name: formData.name,
      cost: parseFloat(formData.cost),
      cycle: formData.cycle,
      category: formData.category,
      renewal_date: formData.renewalDate || new Date().toISOString().split("T")[0],
      status: "Active",
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubscriptionPayload),
      });

      if (response.ok) {
        const savedSub = await response.json();
        // Append the real saved database record (with its real DB id) to state!
        setSubscriptions([...subscriptions, savedSub]);

        // Reset form and close modal
        setFormData({ name: "", cost: "", cycle: "Monthly", category: "Entertainment", renewalDate: "" });
        setIsModalOpen(false);
      } else {
        console.error("Failed to save subscription to database");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER SECTION */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-sky-400 tracking-tight">
              RECUR_TRACK
            </h1>
            <p className="text-zinc-400 mt-1 text-sm">
              Keep track of your recurring expenses and upcoming renewals.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)} className="bg-sky-400 hover:bg-sky-300 text-zinc-950 font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all duration-200 cursor-pointer">
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
              Due on {subscriptions[0]?.renewal_date}
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
                        Renews {sub.renewal_date}
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
        {/* ================= ADD SUBSCRIPTION MODAL ================= */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-800 border border-zinc-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-white">Add New Subscription</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-400 hover:text-white text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubscription} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Disney+, Gym, Notion"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Cost ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="9.99"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Billing Cycle</label>
                    <select
                      value={formData.cycle}
                      onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400 text-sm"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400 text-sm"
                    >
                      <option value="Entertainment">Entertainment</option>
                      <option value="Development">Development</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Health">Health</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Renewal Date</label>
                    <input
                      type="date"
                      value={formData.renewalDate}
                      onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400 text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-400 hover:bg-sky-300 text-zinc-950 font-semibold px-4 py-2 rounded-lg text-sm shadow-md transition-all cursor-pointer"
                  >
                    Save Subscription
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}