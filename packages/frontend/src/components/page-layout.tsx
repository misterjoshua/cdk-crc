import 'bootstrap/dist/css/bootstrap.css';
import Link from 'next/link';
import React from 'react';

export const PageLayout: React.FC = (props) => (
  <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a href="#" className="navbar-brand">
          Josh Kellendonk
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link passHref href="/">
                <a href="" className="nav-link active">
                  Home <span className="sr-only">(current)</span>
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
              <Link passHref href="/">
                <a href="" className="nav-link active">
                  GitHub
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <main>{props.children}</main>
    <footer />
  </>
);
