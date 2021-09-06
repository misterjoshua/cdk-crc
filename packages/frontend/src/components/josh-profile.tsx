import Image from 'next/image';
import React from 'react';
import profilePicture from '../../public/profile-picture.jpg';
import { useHitCount } from '../hooks/use-hit-count';
import { useScreenSize } from '../hooks/use-screen-size';

export const HitCount: React.FC = () => {
  const number = useHitCount();
  return (
    <p className="hit-count">
      {number && (
        <span className="hit-count-loaded">Viewed {number} times</span>
      )}
      &nbsp;
    </p>
  );
};

export interface JoshProfileProps {
  readonly blogPost?: boolean;
}

export const JoshProfile: React.FC<JoshProfileProps> = (props) => {
  const screenSize = useScreenSize();
  const blogPost = props.blogPost ?? false;

  const imageSize = 125;

  return (
    <div className="josh-profile text-center">
      <div>
        <Image
          className="josh-inner-profile-img"
          src={profilePicture}
          width={imageSize}
          height={imageSize}
          alt="Josh's Profile Picture"
        />
      </div>

      {blogPost ? (
        <>
          <h2 className="josh-profile-name">Josh Kellendonk</h2>
          <h3 className="josh-profile-title">
            Full-Stack, Cloud-Native Developer
          </h3>
        </>
      ) : (
        <>
          <h1 className="josh-profile-name">Josh Kellendonk</h1>
          <h2 className="josh-profile-title">
            Full-Stack, Cloud-Native Developer
          </h2>
        </>
      )}

      <div className="josh-profile-link-banner">
        <a
          href="https://github.com/wheatstalk"
          title="Josh's GitHub"
          aria-label="View Josh's GitHub"
        >
          <i className="bi bi-github" />
        </a>
        <a
          href="https://www.linkedin.com/in/kellendonk/"
          title="Josh's LinkedIn"
          aria-label="View Josh's LinkedIn"
        >
          <i className="bi bi-linkedin" />
        </a>
      </div>

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
