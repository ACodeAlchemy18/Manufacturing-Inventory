import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [teamMembers, setTeamMembers] = useState([]);


const [showMemberForm, setShowMemberForm] = useState(false);

const [memberForm, setMemberForm] = useState({
  name: "",
  email: "",
  role: "",
  password: "",
});

  useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  setUser(stored);

  const sub = localStorage.getItem("subscribed");
  setIsSubscribed(sub === "true");

  const savedMembers =
    JSON.parse(localStorage.getItem("teamMembers")) || [];

  setTeamMembers(savedMembers);
}, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
    setIsEditing(false);
    alert("Profile Updated ✅");
  };

  const toggleSubscription = () => {
    const newValue = !isSubscribed;
    setIsSubscribed(newValue);
    localStorage.setItem("subscribed", newValue);
  };

  const handleAddMember = () => {
  if (
    !memberForm.name ||
    !memberForm.email ||
    !memberForm.role ||
    !memberForm.password
  ) {
    alert("Please fill all fields");
    return;
  }

  const newMember = {
    id: Date.now(),
    ...memberForm,
    status: "Active",
  };

  const updatedMembers = [...teamMembers, newMember];

  setTeamMembers(updatedMembers);

  localStorage.setItem(
    "teamMembers",
    JSON.stringify(updatedMembers)
  );

  setMemberForm({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  setShowMemberForm(false);

  alert("Team Member Added ✅");
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {activeTab === "profile" ? "My Profile" : "Manage Plan"}
        </h1>

        <button
          onClick={() => navigate("/inventory/dashboard")}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          Back
        </button>
      </div>

      {/* TABS */}
<div className="flex gap-4 mb-6">
  <button
    onClick={() => setActiveTab("profile")}
    className={`px-5 py-2 rounded-lg ${
      activeTab === "profile"
        ? "bg-black text-white"
        : "bg-white border"
    }`}
  >
    Profile
  </button>

  <button
    onClick={() => setActiveTab("plan")}
    className={`px-5 py-2 rounded-lg ${
      activeTab === "plan"
        ? "bg-black text-white"
        : "bg-white border"
    }`}
  >
    Manage Plan
  </button>

  <button
    onClick={() => setActiveTab("team")}
    className={`px-5 py-2 rounded-lg ${
      activeTab === "team"
        ? "bg-black text-white"
        : "bg-white border"
    }`}
  >
    Team Management
  </button>
</div>

      {/* ================= PROFILE ================= */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT PROFILE CARD */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center justify-center text-center">

            <FaUserCircle className="text-7xl text-gray-400 mb-4" />

            <h2 className="text-xl font-semibold">
              {user.name || "User Name"}
            </h2>

            <p className="text-gray-500">{user.email}</p>

          </div>

          {/* RIGHT DETAILS */}
          <div className="col-span-2 bg-white rounded-2xl shadow p-6">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">User Details</h2>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              {[
                { label: "Name", name: "name" },
                { label: "Email", name: "email" },
                { label: "Company", name: "companyName" },
                { label: "Industry", name: "industryType" },
                { label: "Phone", name: "phone" },
                { label: "Address", name: "address" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Pin Code", name: "pinCode" },
                { label: "GST", name: "gst" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-sm text-gray-500">
                    {field.label}
                  </label>

                  {isEditing ? (
                    <input
                      type="text"
                      name={field.name}
                      value={user[field.name] || ""}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border rounded-lg"
                    />
                  ) : (
                    <p className="font-medium mt-1">
                      {user[field.name] || "-"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= PLAN ================= */}
      {activeTab === "plan" && (
        <div className="grid grid-cols-3 gap-6">

          {[
            {
              name: "Basic",
              price: "Free",
              features: ["Limited Inventory", "Basic Reports"],
            },
            {
              name: "Pro",
              price: "₹499/month",
              features: ["Unlimited Inventory", "Advanced Reports", "Analytics"],
              highlight: true,
            },
            {
              name: "Enterprise",
              price: "Custom",
              features: ["Full Access", "Dedicated Support"],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-2xl shadow bg-white ${plan.highlight ? "border-2 border-black scale-105" : ""
                }`}
            >
              <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
              <p className="text-gray-500 mb-4">{plan.price}</p>

              <ul className="mb-4 text-sm space-y-1">
                {plan.features.map((f, i) => (
                  <li key={i}>✔ {f}</li>
                ))}
              </ul>

              <button
                onClick={toggleSubscription}
                className={`w-full py-2 rounded-lg ${isSubscribed
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                  }`}
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            </div>


          ))}
        </div>
        
      )}


      
    </div>

  );
}

