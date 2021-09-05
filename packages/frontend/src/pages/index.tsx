import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import awsCsaaBadge from '../../public/badges/aws-certified-solutions-architect-associate.png';
import psdBadge from '../../public/badges/professional-scrum-developer-i-psd-i.png';
import psmBadge from '../../public/badges/professional-scrum-master-i-psm-i.png';
import pspoBadge from '../../public/badges/professional-scrum-product-owner-i-pspo-i.png';
import { ContentSection } from '../components/content-section';
import { JoshProfile } from '../components/josh-profile';
import { PageLayout } from '../components/page-layout';
import {
  NiceTranslucentBox,
  ParticularlyHeroic,
} from '../components/particularly-heroic';
import { TextBlock } from '../components/text-block';

const Skills: React.FC = () => (
  <>
    <h3>Tools and Techniques</h3>

    <h4>🔥 Solid Experience</h4>
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

    <h4>🚀 Good Experience</h4>
    <ul>
      <li>C#/.NET4 (WPF & WinRT)</li>
      <li>Golang</li>
      <li>Microsoft SQL Server</li>
      <li>Microsoft Dynamics CRM</li>
    </ul>

    <h4>✔ Some Experience</h4>
    <ul>
      <li>Puppet & Terraform HCL</li>
      <li>Ruby scripting</li>
      <li>Electronics</li>
      <li>Always learning more</li>
    </ul>

    <h4>🏫 Learn-on-demand</h4>
    <p>
      Josh is a quick study, so this list of skills changes quickly. If your
      project or team role needs a skill-set not shown here, please give me a
      call and we can discuss your needs.
    </p>
  </>
);

const WorkHistory: React.FC = () => (
  <>
    <h3>Work History</h3>

    <section>
      <h4>Cloud Solutions Architect / Principal Developer</h4>
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
        <NiceTranslucentBox>
          <JoshProfile />
        </NiceTranslucentBox>
      </ParticularlyHeroic>

      <ContentSection>
        <TextBlock>
          <h3 className="text-center">About Josh</h3>
          <p>
            Josh is a driven entrepreneur and professional developer, relentless
            about producing great value for customers. Using his advanced
            knowledge and experience with cloud-native architectures, Josh
            builds reliable, scalable, and cost-conscious business solutions.
            Josh will make a fantastic addition to your projects and team.
          </p>
        </TextBlock>
      </ContentSection>

      <ContentSection>
        <h3 className="text-center">Certifications</h3>

        <BadgeBar
          badges={[
            {
              href: 'https://www.credly.com/badges/14c0566c-4c34-41d0-95c2-196c0e4aac6d/public_url',
              name: 'Amazon Certificate Solutions Architect - Associate',
              image: awsCsaaBadge,
            },
            {
              href: 'https://www.credly.com/badges/b7e9fb45-9e41-4135-89d5-c8edeacdc681/public_url',
              name: 'Professional Scrum Master',
              image: psmBadge,
            },
            {
              href: 'https://www.credly.com/badges/7e58e8c7-5f66-46c3-956b-cdaf5c0bbe2e/public_url',
              name: 'Professional Scrum Product Owner',
              image: pspoBadge,
            },
            {
              href: 'https://www.credly.com/badges/52cd2d7c-d6df-435d-82ba-1ef7aa6144b1/public_url',
              name: 'Professional Scrum Developer',
              image: psdBadge,
            },
          ]}
        />
      </ContentSection>

      <ContentSection dark>
        <h3 className="text-center">Josh's Experience</h3>
      </ContentSection>

      <ContentSection>
        <div className="row">
          <div className="col-lg-4">
            <Skills />
          </div>
          <div className="col-lg-8 col-sm-">
            <WorkHistory />
          </div>
        </div>
      </ContentSection>
    </PageLayout>
  );
}

export interface BadgeBarProps {
  readonly badges: Array<{
    readonly href: string;
    readonly name: string;
    readonly image: StaticImageData;
  }>;
}

export const BadgeBar: React.FC<BadgeBarProps> = (props) => (
  <>
    <div className="badges">
      {props.badges.map((badge, i) => (
        <a key={i} target="_blank" href={badge.href}>
          <Image src={badge.image} width={125} height={125} alt={badge.name} />
        </a>
      ))}
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
  </>
);
