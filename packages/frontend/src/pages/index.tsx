import { HitCounter } from '../components/hit-counter';

export default function Home() {
  return (
    <>
      <h1>Cloud Resume Challenge</h1>
      <p>Welcome to my Cloud Resume Challenge, prepared in CDK.</p>

      <HitCounter />

      <section>
        <h2>ABOUT ME</h2>
        <p>
          I’m a highly motivated entrepreneur and professional software nerd,
          relentless about producing great value for customers through
          cloud-native apps.
        </p>
        {/*<p>Looking to build more extensive, highly innovative and leading-edge cloud solutions with high performance, progressive technology groups, to both work with and learn from the best and brightest, and to  continue to obsess over what value I’m providing my customers and my peers.</p>*/}
      </section>

      <section>
        <h2>Qualifications</h2>

        <h3>QUALIFICATIONS</h3>
        <p>
          <strong>16 Years’ Multi-Industry Experience</strong>
          <br />
          Developed software for real estate, insurance, medical, financial, oil
          & gas, and entertainment sectors since 2003.
        </p>

        <p>
          <strong>AWS CSAA</strong>
          <br />
          Amazon Web Services Certification.
        </p>

        <p>
          <strong>Scrum/Agile Certifications</strong>
          <br />
          Scrum.org PSM I, PSPO I, PSD Certifications.
        </p>
      </section>

      <section>
        <h2>TOOLS EXPERIENCE</h2>
        <h3>Solid Experience</h3>
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

        <h3>Good Experience</h3>
        <ul>
          <li>C#/.NET4 (WPF & WinRT)</li>
          <li>Golang</li>
          <li>Microsoft SQL Server</li>
          <li>Microsoft Dynamics CRM</li>
        </ul>
        <h3>Some Experience</h3>
        <ul>
          <li>Puppet & Terraform HCL</li>
          <li>Ruby scripting</li>
          <li>Electronics</li>
          <li>Always learning more</li>
        </ul>
      </section>

      <section>
        <h2>WORK EXPERIENCE</h2>
        <section>
          <h3>Cloud Solutions Architect / Developer</h3>
          <em>Sole Proprietorship / Calgary / 2018 - Current</em>
          <ul>
            <li>
              Provided end-to-end services for Calgary-area businesses requiring
              cloud-native solutions and consulting for Amazon, Azure, and
              Kubernetes.
            </li>
            <li>
              Used Amazon ECS, Auto-scaled EC2 instances, Elastic Beanstalk,
              Elastic Load Balancing (ELB & ALB), and AWS serverless
              technologies.
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
              Transitioned on-prem servers, their data, and their workloads to
              the cloud.
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
            <li>
              Deployed a hyper-converged, multi-tenant Kubernetes cluster.
            </li>
            <li>
              Created Docker images, Helm charts, and used Helm Operators via
              the Operator SDK to provision and manage similar environments
              through Custom Resource Definitions.
            </li>
            <li>Created Kubernetes-native RESTful services with client-go.</li>
            <li>
              Developed software solutions and deployed to Heroku & Zeit
              platforms.
            </li>
          </ul>
        </section>

        <section>
          <h3>Principal Developer</h3>
          <em>Pixel Tribe / Calgary / 2015 – 2018</em>
          <ul>
            <li>
              Led a team to develop software for a broad range of internal and
              client projects to ensure the highest standards of consistency and
              quality in development processes, delivered products, and
              services.
            </li>
            <li>
              Created bespoke marketing software, including apps, web portals,
              e-commerce systems, touch-screen sales kiosks, and websites.
            </li>
            <li>
              Provided guidance and mentoring to junior and intermediate
              developers.
            </li>
            <li>Generated marketing ideas and authored client proposals.</li>
          </ul>
        </section>

        <section>
          <h3>Principal Developer</h3>
          <em>SidePix Ltd. / Calgary / 2012 – 2015</em>
          <ul>
            <li>
              Formed a consulting and software development partnership with
              colleagues.
            </li>
            <li>
              Produced bespoke e-commerce systems, membership portals, websites,
              web integrations, and white-label services.
            </li>
            <li>
              Customized and deployed off-the-shelf software, including Dynamics
              CRM.
            </li>
          </ul>
        </section>

        <section>
          <h3>Senior Developer / Vice President of Technology</h3>
          <em>
            The Canadian Equity Group Ltd. (CanEquity) / Calgary / 2007 – 2012
          </em>
          <ul>
            <li>
              Performed maintenance on a large mortgage processing monolith and
              was instrumental in the technology-related decision-making and
              planning at the company.
            </li>
            <li>
              Maintained websites and a mortgage processing backend. Integrated
              the backend with both major mortgage origination systems available
              at the time.
            </li>
            <li>
              Simplified and automated dozens of large, manually run Perl
              scripts.
            </li>
            <li>
              Conducted research and experimentation with EC2 in 2008 and 2009
              and migrated company services from on-prem to EC2 in 2010.
            </li>
          </ul>
        </section>

        <section>
          <h3>Game Developer</h3>
          <em>ClownPhobia / Okotoks / 2003 – 2007</em>
          <ul>
            <li>
              Developed software for both the front-end and backend server code
              for a small game studio, maintaining and adding functionality to
              two large C++ codebases.
            </li>
            <li>
              Developed client and server code in C++ and x86/64 assembler,
              adding major features to the game and performance optimizations.
            </li>
            <li>
              Created a client security module that detected and logged
              misconduct.
            </li>
          </ul>
        </section>
      </section>
    </>
  );
}
