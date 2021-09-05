import Image from 'next/image';
import React from 'react';
import profilePicture from '../../public/profile-picture.jpg';
import { useHitCount } from './hit-counter';
import { useScreenSize } from './use-screen-size';

export const JoshProfile: React.FC = () => {
  const number = useHitCount();
  const screenSize = useScreenSize();

  // On big screens, we want the image bigger.
  const imageSize = screenSize.width < 600 ? 100 : 150;

  return (
    <div className="josh-profile text-center">
      <div>
        <Image
          className="josh-inner-profile-img"
          src={profilePicture}
          width={imageSize}
          height={imageSize}
        />
      </div>

      <h1 className="josh-profile-name">Josh Kellendonk</h1>
      <h2 className="josh-profile-title">Full-Stack, Cloud-Native Developer</h2>

      <div className="josh-profile-link-banner">
        <a
          href="https://github.com/wheatstalk"
          title="Josh's GitHub"
          aria-label="View Josh's GitHub"
        >
          <i className="bi bi-github" aria-label="GitHub" />
        </a>
        <a
          href="https://www.linkedin.com/in/kellendonk/"
          title="Josh's LinkedIn"
          aria-label="View Josh's LinkedIn"
        >
          <i className="bi bi-linkedin" aria-label="LinkedIn" />
        </a>
        <a
          href="https://www.linkedin.com/in/kellendonk/"
          title="Contact Josh"
          aria-label="Contact Josh Kellendonk"
        >
          <i className="bi bi-telephone-outbound" />
        </a>
      </div>

      <p className="josh-profile-view-count">
        {number && <>Viewed {number} times</>}
        &nbsp;
      </p>

      <style jsx global>{`
        .josh-inner-profile-img {
          border-radius: 100px;
        }
      `}</style>
      <style jsx>{`
        .josh-profile {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 50vh;
        }

        .josh-profile-name {
          margin-top: 0.5em;
          font-size: 1.4rem;
        }

        .josh-profile-title {
          font-size: 1rem;
        }

        @media screen and (min-width: 400px) {
          .josh-profile-name {
            font-size: 1.8rem;
          }

          .josh-profile-title {
            font-size: 1.5rem;
          }
        }

        .josh-profile-view-count {
          margin-top: 1rem;
        }

        .josh-profile-link-banner {
          display: flex;
          font-size: 2rem;
          margin-top: 1rem;
          justify-content: center;
        }

        .josh-profile-link-banner a {
          color: white;
          margin: 0 0.5rem;
        }
      `}</style>
    </div>
  );
};
