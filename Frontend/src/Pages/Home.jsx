import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import styled from "styled-components";
const Home = () => {
  const menuRef = useRef(null);
  const logoRef = useRef(null);
  useEffect(() => {  
    localStorage.removeItem("selectedFriend");
    const items = gsap.utils.toArray(menuRef.current.children);
    gsap.fromTo(
      items,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.4, ease: "power2.out" }
    ); 
    gsap.fromTo(
      logoRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "bounce.out" }
    );
  }, []);
  return (
    <div className="flex flex-col min-h-[111vh] bg-zinc-900 text-white">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-between flex-grow p-8">
        {/* Left Side - Project Description */}
        <div
          ref={menuRef}
          className="md:w-1/2 text-center md:text-left space-y-4 font-mono"
        >
          <div>
            <h1 className="text-4xl font-bold ">Contributive Code Editor</h1>
          </div>
          <div>
            <p className="text-lg text-gray-300">
              A powerful online code editor supporting 15+ programming
              languages. Users can upload queries, share problems, and
              collaborate seamlessly.
            </p>
          </div>{" "}
          <div>
            <StyledWrapper>
              <Link to="/folder">
                <button type="button" className="button">
                  <span className="fold" />
                  <div className="points_wrapper">
                    <i className="point" />
                    <i className="point" />
                    <i className="point" />
                    <i className="point" />

                    <i className="point" />
                    <i className="point" />
                    <i className="point" />
                    <i className="point" />
                    <i className="point" />
                    <i className="point" />
                  </div>
                  <span className="inner">
                    <svg
                      className="icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    >
                      <polyline points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37" />
                    </svg>
                    Get Started
                  </span>
                </button>
              </Link>
            </StyledWrapper>
          </div>
        </div>

        {/* Right Side - Logo */}
        <div ref={logoRef} className="md:w-1/2 flex justify-center mt-8 md:mt-0">
          <img src="/middle.svg" alt="Logo" className="w-full h-full" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-800 text-center py-6">
        <div className="container mx-auto px-4">
          {/* Footer Links */}
          <ul className="flex justify-center space-x-6 mb-4 text-gray-400">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link to="/Account" className="hover:text-white">
                Account
              </Link>
            </li>
            <li>
              <Link
                to="/Folder"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Folders
              </Link>
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex justify-center space-x-4 mb-4">
            <a
              href="https://github.com/yourgithub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-xl"
            >
              <FaGithub />
            </a>
            <a
              href="https://twitter.com/yourtwitter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-xl"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com/in/yourlinkedin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-xl"
            >
              <FaLinkedin />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-gray-500">
            © {new Date().getFullYear()} Codenest.IO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const StyledWrapper = styled.div`
  .button {
    --h-button: 48px;
    --w-button: 102px;
    --round: 0.75rem;
    cursor: pointer;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.25s ease;
    background: radial-gradient(
        65.28% 65.28% at 50% 100%,
        rgba(223, 113, 255, 0.8) 0%,
        rgba(223, 113, 255, 0) 100%
      ),
      linear-gradient(0deg, #7a5af8, #7a5af8);
    border-radius: var(--round);
    border: none;
    outline: none;
    padding: 12px 18px;
  }
  .button::before,
  .button::after {
    content: "";
    position: absolute;
    inset: var(--space);
    transition: all 0.5s ease-in-out;
    border-radius: calc(var(--round) - var(--space));
    z-index: 0;
  }
  .button::before {
    --space: 1px;
    background: linear-gradient(
      177.95deg,
      rgba(255, 255, 255, 0.19) 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .button::after {
    --space: 2px;
    background: radial-gradient(
        65.28% 65.28% at 50% 100%,
        rgba(223, 113, 255, 0.8) 0%,
        rgba(223, 113, 255, 0) 100%
      ),
      linear-gradient(0deg, #7a5af8, #7a5af8);
  }
  .button:active {
    transform: scale(0.95);
  }

  .fold {
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    height: 1rem;
    width: 1rem;
    display: inline-block;
    transition: all 0.5s ease-in-out;
    background: radial-gradient(
      100% 75% at 55%,
      rgba(223, 113, 255, 0.8) 0%,
      rgba(223, 113, 255, 0) 100%
    );
    box-shadow: 0 0 3px black;
    border-bottom-left-radius: 0.5rem;
    border-top-right-radius: var(--round);
  }
  .fold::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 150%;
    height: 150%;
    transform: rotate(45deg) translateX(0%) translateY(-18px);
    background-color: #e8e8e8;
    pointer-events: none;
  }
  .button:hover .fold {
    margin-top: -1rem;
    margin-right: -1rem;
  }

  .points_wrapper {
    overflow: hidden;
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: absolute;
    z-index: 1;
  }

  .points_wrapper .point {
    bottom: -10px;
    position: absolute;
    animation: floating-points infinite ease-in-out;
    pointer-events: none;
    width: 2px;
    height: 2px;
    background-color: #fff;
    border-radius: 9999px;
  }
  @keyframes floating-points {
    0% {
      transform: translateY(0);
    }
    85% {
      opacity: 0;
    }
    100% {
      transform: translateY(-55px);
      opacity: 0;
    }
  }
  .points_wrapper .point:nth-child(1) {
    left: 10%;
    opacity: 1;
    animation-duration: 2.35s;
    animation-delay: 0.2s;
  }
  .points_wrapper .point:nth-child(2) {
    left: 30%;
    opacity: 0.7;
    animation-duration: 2.5s;
    animation-delay: 0.5s;
  }
  .points_wrapper .point:nth-child(3) {
    left: 25%;
    opacity: 0.8;
    animation-duration: 2.2s;
    animation-delay: 0.1s;
  }
  .points_wrapper .point:nth-child(4) {
    left: 44%;
    opacity: 0.6;
    animation-duration: 2.05s;
  }
  .points_wrapper .point:nth-child(5) {
    left: 50%;
    opacity: 1;
    animation-duration: 1.9s;
  }
  .points_wrapper .point:nth-child(6) {
    left: 75%;
    opacity: 0.5;
    animation-duration: 1.5s;
    animation-delay: 1.5s;
  }
  .points_wrapper .point:nth-child(7) {
    left: 88%;
    opacity: 0.9;
    animation-duration: 2.2s;
    animation-delay: 0.2s;
  }
  .points_wrapper .point:nth-child(8) {
    left: 58%;
    opacity: 0.8;
    animation-duration: 2.25s;
    animation-delay: 0.2s;
  }
  .points_wrapper .point:nth-child(9) {
    left: 98%;
    opacity: 0.6;
    animation-duration: 2.6s;
    animation-delay: 0.1s;
  }
  .points_wrapper .point:nth-child(10) {
    left: 65%;
    opacity: 1;
    animation-duration: 2.5s;
    animation-delay: 0.2s;
  }

  .inner {
    z-index: 2;
    gap: 6px;
    position: relative;
    width: 100%;
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    transition: color 0.2s ease-in-out;
  }

  .inner svg.icon {
    width: 18px;
    height: 18px;
    transition: fill 0.1s linear;
  }

  .button:focus svg.icon {
    fill: white;
  }
  .button:hover svg.icon {
    fill: transparent;
    animation: dasharray 1s linear forwards, filled 0.1s linear forwards 0.95s;
  }
  @keyframes dasharray {
    from {
      stroke-dasharray: 0 0 0 0;
    }
    to {
      stroke-dasharray: 68 68 0 0;
    }
  }
  @keyframes filled {
    to {
      fill: white;
    }
  }
`;
export default Home;
