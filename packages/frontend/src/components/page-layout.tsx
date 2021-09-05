import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import Link from 'next/link';
import React, { useState } from 'react';

function MainNav() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black">
      <div className="container">
        <Link passHref href="/">
          <a href="" className="navbar-brand">
            Josh Kellendonk
          </a>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded={collapsed ? 'false' : 'true'}
          aria-label="Toggle navigation"
          onClick={() => setCollapsed(!collapsed)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`${collapsed ? 'collapse ' : ''}navbar-collapse`}>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link passHref href="/">
                <a href="" className="nav-link active">
                  Home
                </a>
              </Link>
            </li>

            <li className="nav-item">
              <Link passHref href="/blog">
                <a href="" className="nav-link">
                  Blog
                </a>
              </Link>
            </li>

            <li className="nav-item">
              <a href="https://github.com/wheatstalk" className="nav-link">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export const PageLayout: React.FC = (props) => (
  <>
    <MainNav />
    <main>{props.children}</main>
    <footer />
  </>
);
