import { ATSResumeData } from "@/app/types";

export const FULLSTACK_RESUME_TEMPLATE: ATSResumeData = {
  header: {
    name: "Md Moniruzzaman",
    title: "Full-Stack Developer",
    phone: "+8801979915165",
    email: "alvinmonir411@gmail.com",
    location: "Dhaka, Bangladesh (Open to Remote)",
    portfolioDisplay: "alvinmonir.vercel.app",
    portfolioUrl: "https://alvinmonir.vercel.app",
    githubDisplay: "github.com/alvinmonir411",
    githubUrl: "https://github.com/alvinmonir411",
    linkedinDisplay: "www.linkedin.com/in/moniruzzaman13663",
    linkedinUrl: "https://www.linkedin.com/in/moniruzzaman13663",
  },
  careerObjective:
    "Full-Stack Developer proficient in React, Next.js, Node.js, and NestJS/PostgreSQL. Skilled in transforming complex business needs into scalable, high-performance web applications with real-time features and secure architectures",
  technicalSkills: [
    {
      category: "Front-End",
      skills:
        "React.js, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Context API, React Hook Form, Framer Motion, Responsive Design, Web Performance Optimization",
    },
    {
      category: "Back-End",
      skills:
        "Node.js, Express.js, NestJS, MongoDB, PostgreSQL, TypeORM, Socket.IO, RESTful APIs, JWT, Firebase, Stripe Integration",
    },
    {
      category: "Tools & Platforms",
      skills: "Git, GitHub, VS Code, Netlify, Vercel, npm, Figma, MongoDB, Postman",
    },
  ],
  experience: {
    enabled: false,
    role: "Executive Front End",
    company: "SM Technology",
    duration: "1 year 1 month",
    description:
      "Developed and maintained custom Wix-based websites using Velo and Wix Studio. Collaborated with clients to translate business requirements into responsive, high-performance web solutions.",
  },
  projects: [
    {
      title: "Property Management System — Next.js Full-Stack Application",
      liveUrl: "https://example.com",
      clientSiteUrl: "https://github.com/alvinmonir411",
      technologies: "Next.js, TypeScript, MongoDB, Tailwind CSS, React Hook Form, Framer Motion",
      bullets: [
        "Built a real estate CRM supporting role-based dashboards for agents, admins, and managers.",
        "Implemented automated property-to-lead matching, reducing manual lead handling by ~40%.",
        "Designed end-to-end lead pipelines and lifecycle tracking from inquiry to deal closure with real-time analytics",
      ],
    },
    {
      title: "Enterprise Distribution & Inventory ERP System (Full-Stack)",
      liveUrl: "https://example.com",
      clientSiteUrl: "https://github.com/alvinmonir411",
      serverSiteUrl: "https://github.com/alvinmonir411",
      technologies:
        "Next.js, React, TypeScript, NestJS, PostgreSQL, TypeORM, Socket.IO, Tailwind CSS, JWT",
      bullets: [
        "Engineered a robust, full-stack Enterprise Resource Planning (ERP) platform designed for wholesale distribution, inventory management, and multi-channel order fulfillment.",
        "Developed core modules for Sales & Orders, Stock Movements, Delivery Operations, Dues/Collections, and Supplier Purchases with automated financial ledgers",
        "Built robust API architecture using NestJS and TypeORM, featuring automated database schema management and clean data-seeding routines for test/production environments.",
      ],
    },
  ],
  education: {
    degree: "Bachelor of Social Science (BSS)",
    expectedYear: "Expected 2028",
    location: "Rangpur, Bangladesh",
  },
  languages: "Bengali: Native | English: Comfortable | Hindi: Fluent",
};

export const WIX_FRONTEND_RESUME_TEMPLATE: ATSResumeData = {
  header: {
    name: "Md Moniruzzaman",
    title: "Executive, Front End",
    phone: "+8801979915165",
    email: "alvinmonir411@gmail.com",
    location: "Dhaka, Bangladesh (Open to Remote)",
    portfolioDisplay: "alvinmonir.vercel.app",
    portfolioUrl: "https://alvinmonir.vercel.app",
    githubDisplay: "github.com/alvinmonir411",
    githubUrl: "https://github.com/alvinmonir411",
    linkedinDisplay: "www.linkedin.com/in/moniruzzaman13663",
    linkedinUrl: "https://www.linkedin.com/in/moniruzzaman13663",
  },
  careerObjective:
    "Wix Developer proficient in Wix Studio, Velo, Wix CMS, and JavaScript. Skilled in transforming complex business needs into scalable, high-performance Wix websites with custom functionality, API integrations, dynamic features, and secure architectures.",
  technicalSkills: [
    {
      category: "Wix Development",
      skills:
        "Wix Studio, Velo Backend, Wix CMS, Wix Bookings, Wix Stores, JavaScript (ES6+), HTML5, CSS3, Responsive Design, Web Performance Optimization",
    },
    {
      category: "Back-End",
      skills:
        "Node.js, Express.js, NestJS, MongoDB, PostgreSQL, TypeORM, RESTful APIs, JWT, Firebase, Stripe Integration",
    },
    {
      category: "Tools & Platforms",
      skills: "Git, GitHub, VS Code, Netlify, Vercel, npm, Figma, MongoDB, Postman",
    },
  ],
  experience: {
    enabled: true,
    role: "Executive Front End",
    company: "SM Technology",
    duration: "1 year 1 month",
    description:
      "Developed and maintained custom Wix-based websites using Velo and Wix Studio. Collaborated with clients to translate business requirements into responsive, high-performance web solutions.",
  },
  projects: [
    {
      title: "Linda's Cakes & Catering — E-Commerce & Booking Platform",
      liveUrl: "https://example.com",
      technologies: "Wix Studio, Wix CMS, Wix Bookings, Wix Stores, Custom Velo/JavaScript",
      bullets: [
        "Built scalable Wix CMS collections for real-time menu",
        "Configured secure multi-currency payment gateways with automated confirmation workflows.",
        "Designed an interactive custom cake ordering workflow and automated tasting consultation scheduling using Wix Bookings and Velo.",
      ],
    },
    {
      title: "Gamerz | Device Repair & Booking Platform",
      liveUrl: "https://example.com",
      technologies:
        "Wix Studio, Wix CMS, Wix Bookings, Velo/JavaScript, Wix Data API, Backend Modules",
      bullets: [
        "Built a custom device repair booking workflow with diagnostic forms, service selection, and automated appointment scheduling.",
        "Implemented automated RMA ticket generation and real-time repair status tracking using Wix CMS and Velo backend logic.",
        "Developed role-based administrative functionality and backend event triggers to manage repair requests and custom order workflows.",
      ],
    },
  ],
  education: {
    degree: "Bachelor of Social Science (BSS)",
    expectedYear: "Expected 2028",
    location: "Rangpur, Bangladesh",
  },
  languages: "Bengali: Native | English: Comfortable | Hindi: Fluent",
};
