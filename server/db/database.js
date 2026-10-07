const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'club.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');

// Initialize tables
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      badge TEXT NOT NULL,
      seats INTEGER DEFAULT 100,
      is_mega INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS event_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      college TEXT NOT NULL,
      year_branch TEXT NOT NULL,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      category_label TEXT NOT NULL,
      date TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      read_time TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0,
      is_urgent INTEGER DEFAULT 0,
      image TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      takeaways TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS committee_domains (
      id TEXT PRIMARY KEY,
      domain_name TEXT NOT NULL,
      icon TEXT NOT NULL,
      badge_color TEXT NOT NULL,
      leader_name TEXT NOT NULL,
      leader_title TEXT NOT NULL,
      leader_avatar TEXT NOT NULL,
      leader_linkedin TEXT NOT NULL,
      leader_bio TEXT NOT NULL,
      leader_skills TEXT NOT NULL,
      teammates TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedData();
}

function seedData() {
  // Check if events are already seeded
  const eventCount = db.prepare('SELECT COUNT(*) as count FROM events').get().count;
  if (eventCount === 0) {
    const insertEvent = db.prepare(`
      INSERT INTO events (id, title, category, date, location, description, image, badge, seats, is_mega)
      VALUES (@id, @title, @category, @date, @location, @description, @image, @badge, @seats, @is_mega)
    `);

    const initialEvents = [
      {
        id: 'event-fullstack',
        title: 'Full Stack Development Bootcamp',
        category: 'workshop',
        date: '20 January 2026',
        location: 'Innovation Lab, SVPCET',
        description: 'Master frontend and backend development through hands-on sessions with industry mentors. Learn modern React, Node.js, and REST APIs.',
        image: 'assets_events/full stack.jpg',
        badge: 'Workshop',
        seats: 60,
        is_mega: 0
      },
      {
        id: 'event-hackathon',
        title: 'National InnoHack 2026',
        category: 'hackathon',
        date: '15-17 September 2026',
        location: 'Campus Auditorium & Virtual',
        description: '48-hour national hackathon bringing together 500+ students to build solutions for real-world engineering challenges across education, health, and climate.',
        image: 'assets_events/hackathon.jpg',
        badge: 'Hackathon',
        seats: 250,
        is_mega: 1
      },
      {
        id: 'event-ai-summit',
        title: 'Artificial Intelligence & Robotics Summit',
        category: 'seminar',
        date: '05 October 2026',
        location: 'Tech Seminar Hall',
        description: 'Hands-on exploration into generative AI models, computer vision pipelines, and intelligent robotic automation with senior engineering leads.',
        image: 'assets_events/Ai Innovation.jpg',
        badge: 'Seminar',
        seats: 120,
        is_mega: 1
      },
      {
        id: 'event-community-drive',
        title: 'Community Digital Impact Drive',
        category: 'community',
        date: '12 November 2026',
        location: 'Nagpur Rural Community Hub',
        description: 'Engineering India outreach program teaching practical digital literacy, cybersecurity hygiene, and tech tools to local community schools.',
        image: 'assets_events/community-drive.jpg',
        badge: 'Community',
        seats: 80,
        is_mega: 0
      },
      {
        id: 'event-cloud-devops',
        title: 'Cloud Architecture & DevOps Sprint',
        category: 'workshop',
        date: '05 December 2026',
        location: 'Computer Center 2',
        description: 'Build CI/CD pipelines, orchestrate containerized microservices with Docker and Kubernetes, and deploy serverless architectures on AWS.',
        image: 'assets_events/cloud.jpg',
        badge: 'Workshop',
        seats: 50,
        is_mega: 0
      },
      {
        id: 'event-cyber-summit',
        title: 'Cybersecurity & Ethical Hacking Summit',
        category: 'seminar',
        date: '18 December 2026',
        location: 'Main Auditorium',
        description: 'Comprehensive sessions covering web application penetration testing, network defense strategies, and zero-day threat prevention.',
        image: 'assets_events/cyber.jpg',
        badge: 'Seminar',
        seats: 150,
        is_mega: 0
      },
      {
        id: 'event-codesprint',
        title: 'National Code Sprint 2026',
        category: 'hackathon',
        date: '28 December 2026',
        location: 'Online Coding Arena',
        description: 'Competitive algorithm speed-solving and live collaborative architecture challenges against the sharpest student minds nationwide.',
        image: 'assets_events/code sprint.png',
        badge: 'Hackathon',
        seats: 400,
        is_mega: 1
      }
    ];

    const insertMany = db.transaction((events) => {
      for (const ev of events) insertEvent.run(ev);
    });
    insertMany(initialEvents);
  }

  // Check if announcements are already seeded
  const newsCount = db.prepare('SELECT COUNT(*) as count FROM announcements').get().count;
  if (newsCount === 0) {
    const insertNews = db.prepare(`
      INSERT INTO announcements (id, title, category, category_label, date, timestamp, read_time, is_featured, is_urgent, image, excerpt, body, takeaways, likes)
      VALUES (@id, @title, @category, @category_label, @date, @timestamp, @read_time, @is_featured, @is_urgent, @image, @excerpt, @body, @takeaways, @likes)
    `);

    const initialNews = [
      {
        id: 'news-1',
        title: 'Annual Hackathon for Social Good 2026 Announced!',
        category: 'social',
        category_label: 'Social Initiatives',
        date: 'Aug 12, 2026',
        timestamp: 1786500000000,
        read_time: '4 min read',
        is_featured: 1,
        is_urgent: 0,
        image: 'assets_news/hackathon.jpg',
        excerpt: 'Join over 300+ developers, designers, and community mentors to build open-source tools addressing local education and healthcare challenges.',
        body: '<p>We are thrilled to launch the registration for our flagship annual <strong>Hackathon for Social Good</strong>! This year, our focus centers on <em>"Technology with Purpose"</em> — building scalable, open-source solutions for non-profits and public education centers in our area.</p><p>Participants will have access to cloud computing credits, 1-on-1 mentorship from industry engineers, and workshops on human-centered design principles.</p><p>Whether you are a beginner looking to write your first lines of code or an experienced developer ready to architect systems, there is a space for you!</p>',
        takeaways: JSON.stringify([
          'Registration closes on August 25th, 2026.',
          '$10,000+ in project grant prizes and incubator support.',
          'Tracks in Civic Tech, Accessible Learning, and Eco-Innovation.'
        ]),
        likes: 128
      },
      {
        id: 'news-2',
        title: 'Urgent: Registration Open for Advanced AI & Web Architecture Workshop',
        category: 'technical',
        category_label: 'Technical',
        date: 'Aug 08, 2026',
        timestamp: 1786400000000,
        read_time: '3 min read',
        is_featured: 0,
        is_urgent: 1,
        image: 'assets_news/ai_workshop.jpg',
        excerpt: 'Deep dive into modern full-stack systems, neural network deployment, and high-performance Web APIs with hands-on lab sessions.',
        body: '<p>Our Technical Education team is hosting an intensive weekend bootcamp focusing on deploying production AI models and modern web APIs.</p><p>Learn how to optimize Largest Contentful Paint (LCP), manage async worker loops, and implement secure cloud architecture using modern best practices.</p>',
        takeaways: JSON.stringify([
          'Limited to 50 active seats — reserve your spot today.',
          'Prerequisites: Basic JavaScript and Git experience.',
          'Certificate of Completion issued upon submission of lab project.'
        ]),
        likes: 85
      },
      {
        id: 'news-3',
        title: 'Digital Literacy Drive: Empowering Local Senior Centers with Tech',
        category: 'social',
        category_label: 'Social Initiatives',
        date: 'Aug 05, 2026',
        timestamp: 1786300000000,
        read_time: '5 min read',
        is_featured: 0,
        is_urgent: 0,
        image: 'assets_news/community.jpg',
        excerpt: 'Club members volunteered over 120+ hours teaching digital safety, smartphone navigation, and video calls to senior citizens.',
        body: '<p>As part of our commitment to community empowerment, Engineering India members visited three local senior community centers last weekend.</p><p>We conducted hands-on workshops covering online fraud prevention, digital healthcare portals, and connecting with distant family via video conferencing tools.</p>',
        takeaways: JSON.stringify([
          '120+ volunteer hours logged across 3 community hubs.',
          'Over 90 seniors trained in digital security safety.',
          'Next volunteering cohort opens early September.'
        ]),
        likes: 210
      },
      {
        id: 'news-4',
        title: 'Important Security Alert: Action Required for Club Portal Credentials',
        category: 'urgent',
        category_label: 'Urgent Alerts',
        date: 'Aug 03, 2026',
        timestamp: 1786200000000,
        read_time: '2 min read',
        is_featured: 0,
        is_urgent: 1,
        image: 'assets_news/security-alert.jpg',
        excerpt: 'All members are required to update their multi-factor authentication (MFA) settings before August 15th to maintain repository access.',
        body: '<p>In accordance with our updated cybersecurity guidelines, all active club members and project maintainers must re-verify their MFA credentials on the internal portal.</p><p>Accounts without active 2FA will temporarily lose push privileges to core project repositories after the deadline.</p>',
        takeaways: JSON.stringify([
          'Deadline for mandatory update: August 15th, 2026.',
          'Supports TOTP Authenticator apps and Security Keys.',
          'Contact system administrators if assistance is needed.'
        ]),
        likes: 64
      },
      {
        id: 'news-5',
        title: 'Open Source Grant Awarded for Clean Energy Monitoring Dashboard',
        category: 'technical',
        category_label: 'Technical',
        date: 'Jul 28, 2026',
        timestamp: 1786100000000,
        read_time: '4 min read',
        is_featured: 0,
        is_urgent: 0,
        image: 'assets_news/solar-dashboard.jpg',
        excerpt: 'Our student engineering team won a $5,000 grant to expand IoT solar monitoring software across local community gardens.',
        body: '<p>We are excited to announce that our student project <strong>"EcoMonitor"</strong> has received official funding from the Green Tech Foundation.</p><p>The system uses low-power IoT sensors to track soil moisture, solar energy generation, and rainwater harvesting in real-time, displaying metrics on a public dashboard.</p>',
        takeaways: JSON.stringify([
          'Grant total: $5,000 in hardware and cloud infrastructure.',
          'Repository is 100% open source under MIT License.',
          'New contributor onboarding session next Tuesday.'
        ]),
        likes: 176
      },
      {
        id: 'news-6',
        title: 'Fall Semester Orientation & Project Showcase Schedule Released',
        category: 'social',
        category_label: 'Social Initiatives',
        date: 'Jul 20, 2026',
        timestamp: 1786000000000,
        read_time: '3 min read',
        is_featured: 0,
        is_urgent: 0,
        image: 'assets_news/project-showcase.jpg',
        excerpt: 'Discover upcoming tracks in AI, Mobile App Development, UI/UX Design, and Social Impact engineering at our upcoming orientation.',
        body: '<p>Get ready for the Fall 2026 semester! We will be hosting our Semester Orientation and Project Showcase in the Main Auditorium.</p><p>Come meet project leads, explore active open-source teams, and find out how you can contribute regardless of your skill level.</p>',
        takeaways: JSON.stringify([
          'Location: Main Auditorium & Live Online Stream.',
          'Free snacks, club merchandise, and networking session.',
          'Special keynote by club alumni working in tech.'
        ]),
        likes: 142
      }
    ];

    const insertMany = db.transaction((news) => {
      for (const item of news) insertNews.run(item);
    });
    insertMany(initialNews);
  }

  // Committee Domains & Members Seed Data
  const initialCommittee = [
      {
        id: 'leaders',
        domain_name: 'Leaders',
        icon: 'fa-crown',
        badge_color: '#f59e0b',
        leader_name: 'Dr. Sophia Vance',
        leader_title: 'President & Community Director',
        leader_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        leader_linkedin: 'https://linkedin.com/in/sophia-vance-ai',
        leader_bio: 'Guiding strategic community growth, technical vision, and empowering future engineering leaders across India.',
        leader_skills: JSON.stringify(['Leadership', 'Strategic Growth', 'Public Speaking', 'Tech Mentorship', 'Executive Governance']),
        teammates: JSON.stringify([
          {
            name: 'David Kim',
            role: 'Community Advisory Chair',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/david-kim-nlp',
            bio: 'Guiding student initiatives, university faculty alignment, and executive club governance with 4+ years of campus leadership.',
            skills: ['Governance', 'Strategy', 'Faculty Liaison', 'Policy Drafting']
          },
          {
            name: 'Elena Rostova',
            role: 'Executive Director',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/elena-rostova-data',
            bio: 'Overseeing inter-chapter operations, annual roadmap execution, and student leadership development programs nationwide.',
            skills: ['Operations', 'Roadmapping', 'Executive Oversight', 'Mentorship']
          },
          {
            name: 'Marcus Chen',
            role: 'Vice President of Strategy',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/marcus-chen-ml',
            bio: 'Directing national chapter scaling, industry alliances, and long-term student innovation grant distribution.',
            skills: ['Strategic Growth', 'Partnerships', 'Fundraising', 'Expansion']
          },
          {
            name: 'Aditya Kulkarni',
            role: 'Student Chapter General Secretary',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/aditya-kulkarni-ei',
            bio: 'Coordinating inter-departmental student councils, documentation protocols, and campus administration liaisons.',
            skills: ['Administration', 'Council Coordination', 'Documentation', 'Public Relations']
          },
          {
            name: 'Rhea Deshmukh',
            role: 'Head of External Relations',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/rhea-deshmukh-ei',
            bio: 'Connecting Engineering India with national engineering bodies, alumni networks, and corporate industry sponsors.',
            skills: ['External Affairs', 'Alumni Relations', 'Negotiation', 'Public Speaking']
          },
          {
            name: 'Karan Verma',
            role: 'Quality & Ethics Director',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/karan-verma-ei',
            bio: 'Ensuring high technical standards across all student projects, inclusive culture, and transparent team evaluations.',
            skills: ['Ethics & Compliance', 'Project Review', 'Culture', 'Mentoring']
          },
          {
            name: 'Pooja Iyer',
            role: 'Joint Secretary & Member Welfare',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/pooja-iyer-ei',
            bio: 'Supporting student member onboarding, grievance redressal, and peer mentorship study groups across batches.',
            skills: ['Student Welfare', 'Onboarding', 'Community Building', 'Event Planning']
          }
        ])
      },
      {
        id: 'technical',
        domain_name: 'Technical',
        icon: 'fa-code',
        badge_color: '#38bdf8',
        leader_name: 'Alex Rivera',
        leader_title: 'VP of Engineering & Tech Lead',
        leader_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
        leader_linkedin: 'https://linkedin.com/in/alex-rivera-web',
        leader_bio: 'Spearheading open-source initiatives, system architecture workshops, and fullstack cloud development.',
        leader_skills: JSON.stringify(['React', 'TypeScript', 'Cloud Architecture', 'Python', 'DevOps', 'System Design']),
        teammates: JSON.stringify([
          {
            name: "Liam O'Connor",
            role: 'Backend & Systems Architect',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/liam-oconnor-backend',
            bio: 'Architecting high-throughput distributed microservices, caching layers, and core club API endpoints.',
            skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Docker']
          },
          {
            name: 'Maya Lin',
            role: 'Cloud Infrastructure & DevOps Engineer',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/maya-lin-devops',
            bio: 'Automating Kubernetes clusters, AWS cloud deployments, and continuous integration developer workflows.',
            skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux']
          },
          {
            name: 'Sarah Jenkins',
            role: 'Frontend UI/UX Specialist',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/sarah-jenkins-dev',
            bio: 'Crafting fluid interactive React web experiences, micro-animations, and accessible component design systems.',
            skills: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion', 'Figma']
          },
          {
            name: 'Aryan Mehta',
            role: 'Full Stack Web Developer',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/aryan-mehta-dev',
            bio: 'Building dynamic portal modules, authentication protocols, and database schema migrations across student tools.',
            skills: ['Next.js', 'Express', 'MongoDB', 'REST APIs', 'GraphQL']
          },
          {
            name: 'Sneha Patil',
            role: 'AI & Machine Learning Lead',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/sneha-patil-ml',
            bio: 'Developing predictive machine learning models, NLP assistants, and computer vision projects for campus tech.',
            skills: ['PyTorch', 'TensorFlow', 'Python', 'Computer Vision', 'LangChain']
          },
          {
            name: 'Rohan Joshi',
            role: 'Cybersecurity & Ethical Hacking Lead',
            avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/rohan-joshi-sec',
            bio: 'Auditing application endpoints, vulnerability patching, and organizing university Capture The Flag (CTF) challenges.',
            skills: ['Penetration Testing', 'Network Security', 'OWASP', 'Cryptography']
          },
          {
            name: 'Tanvi Nair',
            role: 'Mobile App Developer',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/tanvi-nair-app',
            bio: 'Creating cross-platform Flutter and React Native mobile applications for club events, check-ins, and notifications.',
            skills: ['Flutter', 'Dart', 'React Native', 'Firebase', 'State Management']
          }
        ])
      },
      {
        id: 'events',
        domain_name: 'Events',
        icon: 'fa-calendar-days',
        badge_color: '#a855f7',
        leader_name: 'Ethan Huntley',
        leader_title: 'Head of Global Events & Hackathons',
        leader_avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80',
        leader_linkedin: 'https://linkedin.com/in/ethan-huntley-sec',
        leader_bio: 'Organizing national tech summits, hackathons, coding sprints, and interactive developer meetups.',
        leader_skills: JSON.stringify(['Event Operations', 'Hackathon Lead', 'Speaker Relations', 'Logistics', 'Stage Direction']),
        teammates: JSON.stringify([
          {
            name: 'Aisha Bello',
            role: 'Summit Logistics Lead',
            avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/aisha-bello-cloud',
            bio: 'Managing multi-day hackathon venue operations, physical infrastructure, and live participant flow for 500+ attendees.',
            skills: ['Venue Ops', 'Crowd Management', 'Vendor Management', 'Budgeting']
          },
          {
            name: 'Samantha Reed',
            role: 'Event Marketing Coordinator',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/samantha-reed-intel',
            bio: 'Driving campus campaign engagement, registration blitzes, and inter-collegiate promotional tours.',
            skills: ['Growth Marketing', 'Campaign Analytics', 'Publicity', 'Social Reach']
          },
          {
            name: 'Vikram Malhotra',
            role: 'Workshop Coordinator',
            avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/vikram-malhotra-sec',
            bio: 'Curating hands-on technical workshops, booking industry keynote mentors, and coordinating lab exercises.',
            skills: ['Curriculum Design', 'Speaker Curation', 'Lab Setup', 'Live Demos']
          },
          {
            name: 'Neha Sharma',
            role: 'Hackathon Operations Manager',
            avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/neha-sharma-events',
            bio: 'Directing 48-hour hackathon logistics, judging panel coordination, problem statement releases, and prize distributions.',
            skills: ['Hackathon Ops', 'Judging Systems', 'Participant Support', 'Mentorship']
          },
          {
            name: 'Kunal Sen',
            role: 'Technical Stage & AV Lead',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/kunal-sen-av',
            bio: 'Controlling stage lighting, multi-camera live streams, sound engineering, and auditorium technical setups.',
            skills: ['Audio/Visual', 'OBS Studio', 'Live Streaming', 'Stage Production']
          },
          {
            name: 'Diya Kapoor',
            role: 'Hospitality & Volunteer Lead',
            avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/diya-kapoor-ei',
            bio: 'Leading the 60+ student volunteer crew, VIP guest hospitality, attendee welcome kits, and on-ground helpdesks.',
            skills: ['Volunteer Management', 'Hospitality', 'Crisis Handling', 'Team Motivation']
          },
          {
            name: 'Rajesh Rao',
            role: 'Registration & Ticketing Lead',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/rajesh-rao-events',
            bio: 'Managing automated QR check-in desks, attendee badge printing systems, and real-time attendance telemetry.',
            skills: ['Ticketing Platforms', 'QR Systems', 'Data Analytics', 'Front Desk Ops']
          }
        ])
      },
      {
        id: 'management',
        domain_name: 'Management',
        icon: 'fa-briefcase',
        badge_color: '#10b981',
        leader_name: 'Amara Nwosu',
        leader_title: 'Director of Operations & Management',
        leader_avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
        leader_linkedin: 'https://linkedin.com/in/amara-nwosu-community',
        leader_bio: 'Managing community chapters, operational efficiency, member onboarding, and organizational partnerships.',
        leader_skills: JSON.stringify(['Operations', 'Team Management', 'Chapter Growth', 'Partnerships', 'Budget Allocation']),
        teammates: JSON.stringify([
          {
            name: 'Daniel Park',
            role: 'Sponsorship & Alliance Lead',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/daniel-park-devrel',
            bio: 'Securing corporate enterprise partnerships, student cloud grants, and hardware sponsorships for major club initiatives.',
            skills: ['Corporate Outreach', 'Pitch Decks', 'Deal Closing', 'Contract Negotiation']
          },
          {
            name: 'Lucas Vance',
            role: 'Regional Operations Manager',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/lucas-vance-events',
            bio: 'Streamlining cross-collegiate chapter communications, physical lab inventory, and shared resource allocations.',
            skills: ['Supply Chain', 'Resource Allocation', 'Team Logistics', 'Cross-Collegiate Ops']
          },
          {
            name: 'Zoe Zhang',
            role: 'Member Engagement Lead',
            avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/zoe-zhang-content',
            bio: 'Fostering an inclusive chapter culture, organizing internal hack sessions, study cohorts, and community pulse checks.',
            skills: ['Community Engagement', 'Pulse Surveys', 'Retreat Planning', 'Internal Culture']
          },
          {
            name: 'Aniket Gupta',
            role: 'Finance & Budget Controller',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/aniket-gupta-fin',
            bio: 'Managing club treasury, auditing event budgets, handling vendor reimbursements, and financial transparency reports.',
            skills: ['Financial Modeling', 'Budget Auditing', 'Procurement', 'Expense Tracking']
          },
          {
            name: 'Simran Kaur',
            role: 'Human Resources & Recruitment Lead',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/simran-kaur-hr',
            bio: 'Directing biannual recruitment drives, applicant technical screening, interview panels, and cohort orientation.',
            skills: ['Interviewing', 'Talent Scouting', 'HR Operations', 'Onboarding Workflows']
          },
          {
            name: 'Varun Chawla',
            role: 'Documentation & Compliance Specialist',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/varun-chawla-ops',
            bio: 'Maintaining official institutional records, college administration permissions, and annual club accreditation reports.',
            skills: ['Compliance', 'Technical Writing', 'MoU Drafting', 'Institutional Relations']
          },
          {
            name: 'Meera Nambiar',
            role: 'Project Management Associate',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/meera-nambiar-pm',
            bio: 'Tracking sprint progress across software and event deliverables, running weekly standups, and maintaining team Notion roadmaps.',
            skills: ['Agile / Scrum', 'Jira', 'Notion Systems', 'Sprint Tracking']
          }
        ])
      },
      {
        id: 'media',
        domain_name: 'Media',
        icon: 'fa-camera-retro',
        badge_color: '#ec4899',
        leader_name: 'Chloe Dubois',
        leader_title: 'Head of Media & Content Production',
        leader_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        leader_linkedin: 'https://linkedin.com/in/chloe-dubois-design',
        leader_bio: 'Directing community branding, video production, graphic design, social media campaigns, and digital press.',
        leader_skills: JSON.stringify(['Digital Media', 'Video Production', 'Brand Design', 'Social Strategy', 'Art Direction']),
        teammates: JSON.stringify([
          {
            name: 'Carlos Gomez',
            role: 'Visual Designer & Brand Artist',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/carlos-gomez-ui',
            bio: 'Designing cinematic vector branding, event banners, badges, conference identity packages, and sticker kits.',
            skills: ['Figma', 'Illustrator', 'Visual Identity', 'Typography', 'Color Theory']
          },
          {
            name: 'Jordan Lee',
            role: 'Creative Media & Video Producer',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/jordan-lee-design',
            bio: 'Shooting high-energy hackathon aftermovies, cinematic YouTube project spotlights, and motion graphics trailers.',
            skills: ['Premiere Pro', 'After Effects', 'Cinematography', 'Sound Design']
          },
          {
            name: 'Nina Patel',
            role: 'Social Media & PR Specialist',
            avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/nina-patel-ux',
            bio: 'Managing community presence across Instagram, LinkedIn, and X, crafting viral announcements and engagement campaigns.',
            skills: ['Content Strategy', 'Copywriting', 'Community Growth', 'Reels Production']
          },
          {
            name: 'Devendra Singh',
            role: '3D Motion Graphics Artist',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/devendra-singh-3d',
            bio: 'Crafting 3D brand animations, futuristic stage renders, isometric illustrations, and kinetic title sequences.',
            skills: ['Blender', 'Cinema 4D', '3D Modeling', 'Motion Graphics']
          },
          {
            name: 'Aanya Roy',
            role: 'Chief Editorial Writer',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/aanya-roy-writer',
            bio: 'Authoring deep-dive engineering articles, monthly club newsletter dispatches, press releases, and journal publications.',
            skills: ['Editorial Writing', 'Technical Journalism', 'Newsletters', 'Proofreading']
          },
          {
            name: 'Kabir Mathur',
            role: 'Event Photographer & Drone Pilot',
            avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/kabir-mathur-photo',
            bio: 'Capturing candid high-speed moments, aerial drone coverage, stage presentations, and keynote portraits during summits.',
            skills: ['Drone Piloting', 'Portrait Photography', 'Lightroom', 'Event Coverage']
          },
          {
            name: 'Ishita Sen',
            role: 'UI/UX & Interaction Designer',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            linkedin: 'https://linkedin.com/in/ishita-sen-ui',
            bio: 'Prototyping responsive web design systems, interactive micro-animations, user journey flows, and mobile UI assets.',
            skills: ['UI Design', 'Wireframing', 'User Research', 'Interactive Prototypes']
          }
        ])
      }
    ];

    const insertOrReplaceCommittee = db.prepare(`
      INSERT OR REPLACE INTO committee_domains (id, domain_name, icon, badge_color, leader_name, leader_title, leader_avatar, leader_linkedin, leader_bio, leader_skills, teammates)
      VALUES (@id, @domain_name, @icon, @badge_color, @leader_name, @leader_title, @leader_avatar, @leader_linkedin, @leader_bio, @leader_skills, @teammates)
    `);

    const syncCommittee = db.transaction((domains) => {
      for (const dom of domains) insertOrReplaceCommittee.run(dom);
    });
    syncCommittee(initialCommittee);

  // Seed sample registration and contact inquiry if empty
  const regCount = db.prepare('SELECT COUNT(*) as count FROM event_registrations').get().count;
  if (regCount === 0) {
    db.prepare(`
      INSERT INTO event_registrations (event_id, full_name, email, phone, college, year_branch)
      VALUES ('event-fullstack', 'Rohan Sharma', 'rohan@svpcet.edu.in', '+91 98765 12345', 'St. Vincent Pallotti College', '3rd Year Computer Science')
    `).run();
  }

  const inqCount = db.prepare('SELECT COUNT(*) as count FROM contact_inquiries').get().count;
  if (inqCount === 0) {
    db.prepare(`
      INSERT INTO contact_inquiries (full_name, email, subject, message, status)
      VALUES ('Aarav Patel', 'aarav@example.com', 'Partnership for Hackathon', 'We would love to partner with Engineering India for the upcoming national hackathon.', 'unread')
    `).run();
  }

  const subCount = db.prepare('SELECT COUNT(*) as count FROM newsletter_subscribers').get().count;
  if (subCount === 0) {
    db.prepare(`
      INSERT INTO newsletter_subscribers (email)
      VALUES ('student@svpcet.edu.in')
    `).run();
  }
}

// Call init on require
initDatabase();

module.exports = db;
