import { useState, useRef, useEffect } from "react";
import { FiUploadCloud, FiUsers, FiPieChart, FiActivity, FiUser, FiLogOut, FiSun, FiMoon, FiChevronDown } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";

/* SCREENS */
import DataIngestion from "./DataIngestion";
import CustomerConsumption from "./CustomerConsumption";
import TariffDistribution from "./TariffDistribution";
import DataSimulation from "./DataSimulation";

export default function Navbar({ isDark, setIsDark }) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  /* IMPORTANT */
  const [activeComponent, setActiveComponent] =
    useState("DataIngestion");

  const dropdownRef = useRef(null);

  const navItems = [
    {
      label: "Data Ingest",
      component: "DataIngestion",
      icon: <FiUploadCloud />,
    },
    {
      label: "Customer Consumption",
      component: "CustomerConsumption",
      icon: <FiUsers />,
    },
    {
      label: "Tariff Distribution",
      component: "TariffDistribution",
      icon: <FiPieChart />,
    },
    {
      label: "Data Simulation",
      component: "DataSimulation",
      icon: <FiActivity />,
    },
  ];

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Guest User");
    setUserEmail(localStorage.getItem("userEmail") || "user@email.com");
  }, []);

  useEffect(() => {
    const closeMenu = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () =>
      document.removeEventListener("mousedown", closeMenu);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* SCREEN SWITCHER */
  const renderComponent = () => {
    if (activeComponent === "DataIngestion")
      return <DataIngestion isDark={isDark} />;

    if (activeComponent === "CustomerConsumption")
      return <CustomerConsumption isDark={isDark} />;

    if (activeComponent === "TariffDistribution")
      return <TariffDistribution isDark={isDark} />;

    if (activeComponent === "DataSimulation")
      return <DataSimulation isDark={isDark} />;

    return <DataIngestion isDark={isDark} />;
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-50"
      }`}
    >
      {/* NAVBAR */}
      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          isDark
            ? "bg-slate-950/80 border-white/10"
            : "bg-white/80 border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[74px] flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-lg">
                <HiOutlineLightningBolt size={20} />
              </div>

              <div>
                <h1 className="text-xl font-black">
                  Smart<span className="text-cyan-400">App</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                  analytics suite
                </p>
              </div>
            </div>

            {/* NAV ITEMS */}
            <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-2xl border bg-white/5 border-white/10">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setActiveComponent(item.component)
                  }
                  className={`relative group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                    activeComponent === item.component
                      ? "text-cyan-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}

                  <span
                    className={`absolute left-3 right-3 -bottom-[2px] h-[2px] rounded-full transition-all duration-300 ${
                      activeComponent === item.component
                        ? "scale-x-100 bg-gradient-to-r from-cyan-400 to-purple-500"
                        : "scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-cyan-400 to-purple-500"
                    }`}
                  ></span>
                </button>
              ))}
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
              >
                {isDark ? <FiSun /> : <FiMoon />}
              </button>

              {/* User */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setIsUserDropdownOpen(!isUserDropdownOpen)
                  }
                  className="flex items-center gap-2 px-2 py-1.5 rounded-2xl border bg-white/5 border-white/10"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>

                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold">
                      {userName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Workspace
                    </p>
                  </div>

                  <FiChevronDown />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900 border border-white/10 p-2 shadow-2xl">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm">
                      <FiUser />
                      Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-red-500 text-white text-sm mt-1"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* PAGE CHANGES HERE */}
      <main className="p-6">{renderComponent()}</main>
    </div>
  );
}