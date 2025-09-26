import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ setUser, setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("token"); // token bhi remove ho

    // ✅ Reset app state
    setUser(null);
    setToken(null);

    // ✅ Short delay ke baad redirect, taake Navbar properly re-render ho jaye
    const timer = setTimeout(() => {
      navigate("/login");
    }, 100); // 100ms delay

    return () => clearTimeout(timer);
  }, [setUser, setToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-700 text-lg">Logging out...</p>
    </div>
  );
};

export default Logout;
