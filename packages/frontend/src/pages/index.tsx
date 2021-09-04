import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import awsCsaaBadge from '../../public/badges/aws-certified-solutions-architect-associate.png';
import psdBadge from '../../public/badges/professional-scrum-developer-i-psd-i.png';
import psmBadge from '../../public/badges/professional-scrum-master-i-psm-i.png';
import pspoBadge from '../../public/badges/professional-scrum-product-owner-i-pspo-i.png';
import profilePicture from '../../public/profile-picture.jpg';
import { useHitCount } from '../components/hit-counter';
import { PageLayout } from '../components/page-layout';
import {
  ParticularlyHeroic,
  ParticularlyHeroicInner,
} from '../components/particularly-heroic';

function useDimensions() {
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    resize();

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);

    function resize() {
      setWidth(window.visualViewport.width);
      setHeight(window.visualViewport.height);
    }
  }, [setWidth, setHeight]);

  return {
    width,
    height,
  };
}

const JoshInnerProfile = () => {
  const number = useHitCount();
  const dims = useDimensions();

  // On big screens, we want this bigger.
  const imageSize = dims.width > 600 ? 150 : 100;

  return (
    <ParticularlyHeroicInner>
      <div style={{ height: imageSize }}>
        <Image
          src={profilePicture}
          className="josh-inner-profile-img"
          width={imageSize}
          height={imageSize}
        />
      </div>

      <h1>Josh Kellendonk</h1>
      <h2>Full-Stack, Cloud-Native Developer</h2>

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

      {number && <p className="view-count">Viewed {number} times</p>}

      <style jsx>{`
        * {
          text-align: center;
        }

        h1 {
          margin-top: 0.5em;
          font-size: 1.4rem;
        }

        h2 {
          font-size: 1rem;
        }

        @media screen and (min-width: 400px) {
          h1 {
            font-size: 1.8rem;
          }

          h2 {
            font-size: 1.5rem;
          }
        }

        h2 span {
          white-space: nowrap;
        }

        .view-count {
          margin-top: 1rem;
        }

        .josh-profile-link-banner {
          display: flex;
          font-size: 2rem;
          margin-top: 1rem;
        }

        .josh-profile-link-banner a {
          color: white;
          margin: 0 0.5rem;
        }
      `}</style>

      <style jsx global>{`
        .josh-inner-profile-img {
          border-radius: 100px;
        }
      `}</style>
    </ParticularlyHeroicInner>
  );
};

const JoshProfile = () => (
  <div className="nice-layout">
    <JoshInnerProfile />

    <style jsx>{`
      .nice-layout {
        height: 100%;
        display: flex;
        justify-content: center;
      }
    `}</style>
  </div>
);

const Skills: React.FC = () => (
  <>
    <h3>Tools and Techniques</h3>
    <p>Here are my experience levels with some key tools and techniques:</p>

    <h4>Solid Experience</h4>
    <ul>
      <li>CloudFormation (YAML), AWS CDK</li>
      <li>EC2, Autoscaling, ELB/ALB, & ECS</li>
      <li>CodePipeline + CodeBuild, TravisCI, & Bitbucket Pipelines</li>
      <li>JIRA for Agile and Scrum processes</li>
      <li>Bash scripting</li>
      <li>PowerShell scripting</li>
      <li>Python / Pandas / NumPy</li>
      <li>Java / Kotlin / Spring Framework</li>
      <li>Kubernetes</li>
      <li>Typescript / React / Node.js</li>
      <li>Visual communication tools</li>
    </ul>

    <h4>Good Experience</h4>
    <ul>
      <li>C#/.NET4 (WPF & WinRT)</li>
      <li>Golang</li>
      <li>Microsoft SQL Server</li>
      <li>Microsoft Dynamics CRM</li>
    </ul>

    <h4>Some Experience</h4>
    <ul>
      <li>Puppet & Terraform HCL</li>
      <li>Ruby scripting</li>
      <li>Electronics</li>
      <li>Always learning more</li>
    </ul>

    <h4>Learn-on-demand</h4>
    <p>
      Josh is a quick study, so this list of skills changes quickly. If your
      project or team role wants any certain skills not shown here, please give
      me a call and we can discuss your needs.
    </p>
  </>
);

const WorkExperience: React.FC = () => (
  <>
    <h3>Work Experience</h3>
    <p>
      Josh has had extensive experience in marketing and advertising technology.
    </p>

    <section>
      <h4>Cloud Solutions Architect / Developer</h4>
      <em>Sole Proprietorship / Calgary / 2018 - Current</em>
      <ul>
        <li>
          Provided end-to-end services for Calgary-area businesses requiring
          cloud-native solutions and consulting for Amazon, Azure, and
          Kubernetes.
        </li>
        <li>
          Used Amazon ECS, Auto-scaled EC2 instances, Elastic Beanstalk, Elastic
          Load Balancing (ELB & ALB), and AWS serverless technologies.
        </li>
        <li>
          Produced CI/CD pipelines for infrastructure, application code, and
          automated functional testing.
        </li>
        <li>
          Performed deployment following the Infrastructure as Code paradigm
          with CloudFormation and Azure Resource Manager templates.
        </li>
        <li>
          Transitioned on-prem servers, their data, and their workloads to the
          cloud.
        </li>
        <li>
          Trained customers on AWS infrastructure management & disaster
          recovery.
        </li>
        <li>
          Provided customer service and support for all products while
          concurrently updating documentation and training resources.
        </li>
        <li>Developed RESTful and GraphQL APIs in Java and Node.js.</li>
        <li>Deployed a hyper-converged, multi-tenant Kubernetes cluster.</li>
        <li>
          Created Docker images, Helm charts, and used Helm Operators via the
          Operator SDK to provision and manage similar environments through
          Custom Resource Definitions.
        </li>
        <li>Created Kubernetes-native RESTful services with client-go.</li>
        <li>
          Developed software solutions and deployed to Heroku & Zeit platforms.
        </li>
      </ul>
    </section>

    <section>
      <h4>Principal Developer</h4>
      <em>Pixel Tribe / Calgary / 2015 – 2018</em>
      <ul>
        <li>
          Led a team to develop software for a broad range of internal and
          client projects to ensure the highest standards of consistency and
          quality in development processes, delivered products, and services.
        </li>
        <li>
          Created bespoke marketing software, including apps, web portals,
          e-commerce systems, touch-screen sales kiosks, and websites.
        </li>
        <li>
          Provided guidance and mentoring to junior and intermediate developers.
        </li>
        <li>Generated marketing ideas and authored client proposals.</li>
      </ul>
    </section>

    <section>
      <h4>Principal Developer</h4>
      <em>SidePix Ltd. / Calgary / 2012 – 2015</em>
      <ul>
        <li>
          Formed a consulting and software development partnership with
          colleagues.
        </li>
        <li>
          Produced bespoke e-commerce systems, membership portals, websites, web
          integrations, and white-label services.
        </li>
        <li>
          Customized and deployed off-the-shelf software, including Dynamics
          CRM.
        </li>
      </ul>
    </section>

    <section>
      <h4>Senior Developer / Vice President of Technology</h4>
      <em>
        The Canadian Equity Group Ltd. (CanEquity) / Calgary / 2007 – 2012
      </em>
      <ul>
        <li>
          Performed maintenance on a large mortgage processing monolith and was
          instrumental in the technology-related decision-making and planning at
          the company.
        </li>
        <li>
          Maintained websites and a mortgage processing backend. Integrated the
          backend with both major mortgage origination systems available at the
          time.
        </li>
        <li>
          Simplified and automated dozens of large, manually run Perl scripts.
        </li>
        <li>
          Conducted research and experimentation with EC2 in 2008 and 2009 and
          migrated company services from on-prem to EC2 in 2010.
        </li>
      </ul>
    </section>

    <section>
      <h4>Game Developer</h4>
      <em>ClownPhobia / Okotoks / 2003 – 2007</em>
      <ul>
        <li>
          Developed software for both the front-end and backend server code for
          a small game studio, maintaining and adding functionality to two large
          C++ codebases.
        </li>
        <li>
          Developed client and server code in C++ and x86/64 assembler, adding
          major features to the game and performance optimizations.
        </li>
        <li>
          Created a client security module that detected and logged misconduct.
        </li>
      </ul>
    </section>
  </>
);

export default function Home() {
  return (
    <PageLayout>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Home Page" />
      </Head>

      <ParticularlyHeroic>
        <JoshProfile />
      </ParticularlyHeroic>

      <ContentSection>
        <div className="lonesome-text">
          <h3>About Josh</h3>
          <p>
            Josh is a highly motivated entrepreneur and professional developer,
            relentless about producing great value for customers. Using advanced
            knowledge and experience with cloud-native architectures, Josh
            builds reliable, scalable, and cost-conscious solutions. Josh is
            driven, charismatic, and will make a fantastic addition to your
            projects and team.
          </p>
        </div>
        <style jsx>{`
          .lonesome-text {
            max-width: 800px;
            margin: 0 auto;
          }
        `}</style>
      </ContentSection>

      <ContentSection>
        <h3 className="title">Certifications</h3>

        <div className="badges">
          <a
            target="_blank"
            href="https://www.credly.com/badges/14c0566c-4c34-41d0-95c2-196c0e4aac6d/public_url"
          >
            <Image
              src={awsCsaaBadge}
              width={125}
              height={125}
              alt="Amazon Certificate Solutions Architect - Associate"
            />
          </a>

          <a
            target="_blank"
            href="https://www.credly.com/badges/b7e9fb45-9e41-4135-89d5-c8edeacdc681/public_url"
          >
            <Image
              src={psmBadge}
              width={125}
              height={125}
              alt="Professional Scrum Master"
            />
          </a>

          <a
            target="_blank"
            href="https://www.credly.com/badges/7e58e8c7-5f66-46c3-956b-cdaf5c0bbe2e/public_url"
          >
            <Image
              src={pspoBadge}
              width={125}
              height={125}
              alt="Professional Scrum Product Owner"
            />
          </a>

          <a
            target="_blank"
            href="https://www.credly.com/badges/52cd2d7c-d6df-435d-82ba-1ef7aa6144b1/public_url"
          >
            <Image
              src={psdBadge}
              width={125}
              height={125}
              alt="Professional Scrum Developer"
            />
          </a>
        </div>

        <style jsx>{`
          .badges {
            margin-top: 2rem;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
          }

          .title {
            text-align: center;
          }
        `}</style>
      </ContentSection>

      <ContentSection>
        <div className="row">
          <div className="col-md-4">
            <Skills />
          </div>

          <div className="col-md-8">
            <WorkExperience />
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  );
}

export const ContentSection: React.FC = (props) => (
  <section>
    <div className="container">{props.children}</div>

    <style jsx>{`
      section {
        padding-top: 3rem;
      }
    `}</style>
  </section>
);
