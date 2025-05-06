import { Outlet, Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { CiMenuBurger } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const Layout = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Controls mobile nav menu
  const [menuOpensm, setMenuOpenSM] = useState(false); // Controls mobile nav menu
  const [profileOpen, setProfileOpen] = useState(false); // Controls mobile profile sidebar
  const logoRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const handleLogout = () => { 
    logout(userData.id); 
    localStorage.removeItem("authToken");
    navigate("/Loginform");
  };

  useEffect(() => {
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: "bounce.out" }
    );
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: "power2.out" }
    );
    if (menuRef.current) {
      const items = gsap.utils.toArray(menuRef.current.children);
      gsap.fromTo(
        items,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.5,
          stagger: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="bg-[#121212] w-full text-[#F2F3F4] py-3 px-4">
        <nav className="flex justify-between items-center">
          <h1
            ref={logoRef}
            className="text-2xl text-[#9966CC] font-semibold font-comfortaa"
          >
            CodeNest.io
          </h1>

          {/* Desktop Navigation (screens >= lg) */}
          <div className="hidden lg:flex items-center">
            <div ref={menuRef} className="font-comfortaa flex">
              <Link
                to="/"
                className="text-xl ml-3 cursor-pointer font-semibold hover:border-b-2 border-red-500"
              >
                Home
              </Link>
              <Link
                to="/problemset"
                className="text-xl ml-3 cursor-pointer font-semibold hover:border-b-2 border-red-500"
              >
                Problems
              </Link>
              <Link
                to="/MessagePage"
                className="text-xl ml-3 cursor-pointer font-semibold hover:border-b-2 border-red-500"
              >
                Chat
              </Link>
              <Link
                to="/Folder"
                className="text-xl ml-3 cursor-pointer font-semibold hover:border-b-2 border-red-500"
              >
                Folders
              </Link>
              {userData ? null : (
                <Link
                  to="/Loginform"
                  className="text-2xl ml-3 cursor-pointer font-semibold hover:border-b-2 border-red-500"
                >
                  Login
                </Link>
              )}
            </div>
            {userData && (
              <button
                ref={buttonRef}
                onClick={() => setProfileOpen(!profileOpen)}
                className="ml-4 text-3xl"
              >
                <CgProfile color="white" size={25} />
              </button>
            )}
          </div>

          {/* Mobile Navigation (screens < lg) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-3xl text-white"
            >
              {menuOpen ? <RxCross2 /> : <CiMenuBurger />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
         
          className="fixed top-[10vh] right-0 z-40 bg-zinc-800 text-white p-5 w-80 transform transition-transform duration-300"
        >
          <div  onMouseLeave={() => { 
            console.log("Mouse left the menu");
            setMenuOpen(!menuOpen);
          }} className="flex flex-col">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-xl my-2 cursor-pointer font-semibold "
            >
              Home
            </Link>
            <Link
              to="/problemset"
              onClick={() => setMenuOpen(false)}
              className="text-xl my-2 cursor-pointer font-semibold "
            >
              Problems
            </Link>
            <Link
              to="/MessagePage"
              onClick={() => setMenuOpen(false)}
              className="text-xl my-2 cursor-pointer font-semibold  "
            >
              Chat
            </Link>
            <Link
              to="/Folder"
              onClick={() => setMenuOpen(false)}
              className="text-xl my-2 cursor-pointer font-semibold "
            >
              Folders
            </Link>
            {userData ? null : (
              <Link
                to="/Loginform"
                onClick={() => setMenuOpen(false)}
                className="text-2xl my-2 cursor-pointer font-semibold"
              >
                Login
              </Link>
            )}
            {userData && (
              <p
                onClick={() => {
                  // When Account is clicked, open profile and close menu
                  setProfileOpen(true);
                  setMenuOpen(false);
                  setMenuOpenSM(true);
                }}
                className="text-xl my-2 cursor-pointer font-semibold"
              >
                Account
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Profile Sidebar */}
      {profileOpen && menuOpensm && userData && (
        <div className="insidediv fixed top-[10vh] right-0 z-50 bg-zinc-800 text-white p-5 w-80 transform transition-transform duration-300">
          <h2 className="text-lg text-purple-400 font-semibold flex justify-between items-center">
            {userData.username}{" "}
            <RxCross2
              onClick={() => {
                setProfileOpen(false);
                setMenuOpen(true);
                setMenuOpenSM(false);
              }}
            />
          </h2>
          <ul className="mt-4 text-xl">
            <Link to="/Account" onClick={() => setProfileOpen(false)}>
              <li className="py-1 px-2 rounded-md hover:bg-zinc-700 cursor-pointer">
                Profile
              </li>
            </Link>
            <Link to="/addfriends" onClick={() => setProfileOpen(false)}>
              <li className="py-1 px-2 rounded-md hover:bg-zinc-700 cursor-pointer">
                Add Friend
              </li>
            </Link>
            <li className="py-1 px-2 rounded-md hover:bg-zinc-700 cursor-pointer">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}

      {/* Desktop Profile Sidebar (if open on larger screens) */}
      {profileOpen && (
        <div
          className="hidden lg:block fixed top-[10vh] right-0 z-40 bg-zinc-800 text-white p-5 w-96 transform transition-transform duration-300"
          onMouseLeave={() => setProfileOpen(false)}
        >
          <div className="p-4">
            <h2 className="text-lg text-purple-400 font-semibold">
              {userData.username}
            </h2>
            <ul className="mt-4 text-xl">
              <Link to="/Account">
                <li className="py-1 px-2 rounded-md hover:bg-zinc-700 cursor-pointer">
                  Profile
                </li>
              </Link>
              <Link to="/addfriends">
                <li className="py-1 px-2 rounded-md hover:bg-zinc-700 cursor-pointer">
                  Add Friend
                </li>
              </Link>
              <li className="py-1 px-2 rounded-md hover:bg-zinc-700 cursor-pointer">
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default Layout;
