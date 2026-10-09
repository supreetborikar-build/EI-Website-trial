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

    DROP TABLE IF EXISTS committee_domains;
    DROP TABLE IF EXISTS committee_members;

    CREATE TABLE committee_domains (
      id TEXT PRIMARY KEY,
      domain_name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      description TEXT DEFAULT '',
      icon TEXT NOT NULL,
      badge_color TEXT NOT NULL,
      leader_name TEXT NOT NULL,
      leader_title TEXT NOT NULL,
      leader_avatar TEXT NOT NULL,
      leader_year TEXT DEFAULT '',
      leader_branch TEXT DEFAULT '',
      leader_uid TEXT DEFAULT '',
      teammates TEXT NOT NULL
    );

    CREATE TABLE committee_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain_id TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      year TEXT NOT NULL,
      branch TEXT NOT NULL,
      uid TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      is_head INTEGER DEFAULT 0,
      is_co_head INTEGER DEFAULT 0,
      linkedin TEXT DEFAULT '',
      github TEXT DEFAULT '',
      tagline TEXT DEFAULT ''
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

  // Official Engineering India - SVPCET Domain Structure & Members (6 Domains, 48 Members)
  const officialCommitteeDomains = [
    {
      id: 'secretary',
      domain_name: 'Secretary',
      short_name: 'Secretariat',
      description: 'Managing committee governance, official documentation, record keeping, and student body administration.',
      icon: 'fa-file-signature',
      badge_color: '#6366f1',
      leader_name: 'Vedant Chamat',
      leader_title: 'Secretary',
      leader_avatar: '/assets_committee/EI-Photo/Vedant%20Chamat.jpeg',
      leader_year: '3rd',
      leader_branch: 'Industrial IoT',
      leader_uid: '24009033',
      teammates: JSON.stringify([
        { name: 'Mrunmayee Chaudhari', year: '3rd', branch: 'Information Technology', role: 'Secretary', avatar: '/assets_committee/EI-Photo/Mrunmayee%20Chaudhrai.jpeg', uid: '24010060' },
        { name: 'Nimish Chamat', year: '3rd', branch: 'Civil Engineering', role: 'Secretary', avatar: '', uid: '24002023' },
        { name: 'Palak Dongre', year: '3rd', branch: 'Electronics and Telecommunication', role: 'Secretary', avatar: '', uid: '24008055' }
      ]),
      members: [
        { name: 'Vedant Chamat', year: '3rd', branch: 'Industrial IoT', role: 'Secretary', avatar: '/assets_committee/EI-Photo/Vedant%20Chamat.jpeg', uid: '24009033', isHead: true, isCoHead: false, tagline: 'A BOY WITH A DREAM.', linkedin: 'https://www.linkedin.com/in/vedant-chamat-9989ab328', github: '' },
        { name: 'Mrunmayee Chaudhari', year: '3rd', branch: 'Information Technology', role: 'Secretary', avatar: '/assets_committee/EI-Photo/Mrunmayee%20Chaudhrai.jpeg', uid: '24010060', isHead: false, isCoHead: false, tagline: '', linkedin: '', github: '' },
        { name: 'Nimish Chamat', year: '3rd', branch: 'Civil Engineering', role: 'Secretary', avatar: '', uid: '24002023', isHead: false, isCoHead: false, tagline: '', linkedin: '', github: '' },
        { name: 'Palak Dongre', year: '3rd', branch: 'Electronics and Telecommunication', role: 'Secretary', avatar: '', uid: '24008055', isHead: false, isCoHead: false, tagline: 'Welcome To MULTIVERSE OF MADNESS!!!', linkedin: 'https://www.linkedin.com/in/palakdongre05', github: '' }
      ]
    },
    {
      id: 'documentation',
      domain_name: 'Documentation',
      short_name: 'Documentation',
      description: 'Overseeing technical reporting, event dossiers, research archives, and official communications.',
      icon: 'fa-file-lines',
      badge_color: '#8b5cf6',
      leader_name: 'Apurva Mohite',
      leader_title: 'Documentation Head',
      leader_avatar: '',
      leader_year: '3rd',
      leader_branch: 'Industrial IoT',
      leader_uid: '24009038',
      teammates: JSON.stringify([
        { name: 'Roopam Zade', year: '3rd', branch: 'Industrial IoT', role: 'Documentation Co-head', avatar: '/assets_committee/EI-Photo/Roopam_Zade.png', uid: '24009041', isCoHead: true },
        { name: 'Ayush Chauhan', year: '2nd', branch: 'Artificial Intelligence', role: 'Documentation', avatar: '', uid: '25001043' },
        { name: 'Hariom Shrinath', year: '3rd', branch: 'Electronics and Telecommunication', role: 'Documentation', avatar: '/assets_committee/EI-Photo/Hariom%20Shrinath.jpg', uid: '25108006' },
        { name: 'Antariksh Pilare', year: '2nd', branch: 'Civil', role: 'Documentation', avatar: '', uid: '25002050' },
        { name: 'Pranay Mune', year: '2nd', branch: 'CSE', role: 'Documentation', avatar: '/assets_committee/EI-Photo/Pranay%20Mune.jpg', uid: '25013120' },
        { name: 'Vaibhavi Purohit', year: '2nd', branch: 'Robotics and Artificial Intelligence', role: 'Documentation', avatar: '/assets_committee/EI-Photo/Vaibhavi.jpg', uid: '25012027' },
        { name: 'Lakshita Bisen', year: '2nd', branch: 'Information Technology', role: 'Documentation', avatar: '/assets_committee/EI-Photo/Lakshita%20Bisen.jpeg', uid: '25010032' },
        { name: 'Jennifer Joseph', year: '3rd', branch: 'Information Technology', role: 'Documentation', avatar: '', uid: '24010002' }
      ]),
      members: [
        { name: 'Apurva Mohite', year: '3rd', branch: 'Industrial IoT', role: 'Documentation Head', avatar: '', uid: '24009038', isHead: true, isCoHead: false, tagline: '', linkedin: 'https://www.linkedin.com/in/apurva-mohite-24b869332', github: '' },
        { name: 'Roopam Zade', year: '3rd', branch: 'Industrial IoT', role: 'Documentation Co-head', avatar: '/assets_committee/EI-Photo/Roopam_Zade.png', uid: '24009041', isHead: false, isCoHead: true, tagline: 'Still figuring it out. Still moving forward.', linkedin: 'https://www.linkedin.com/in/roopam-zade-1a32b13b6', github: 'https://github.com/roopamzade1902-tech' },
        { name: 'Ayush Chauhan', year: '2nd', branch: 'Artificial Intelligence', role: 'Documentation', avatar: '', uid: '25001043', isHead: false, isCoHead: false, tagline: '', linkedin: '', github: '' },
        { name: 'Hariom Shrinath', year: '3rd', branch: 'Electronics and Telecommunication', role: 'Documentation', avatar: '/assets_committee/EI-Photo/Hariom%20Shrinath.jpg', uid: '25108006', isHead: false, isCoHead: false, tagline: 'Work in silence. Let progress speak.', linkedin: 'https://www.linkedin.com/in/hariom-shrinath-a579693a1/', github: '' },
        { name: 'Antariksh Pilare', year: '2nd', branch: 'Civil', role: 'Documentation', avatar: '', uid: '25002050', isHead: false, isCoHead: false, tagline: 'Courage in the heart, fire in the soul.', linkedin: 'https://www.linkedin.com/in/antariksh-pilare-a763a437b', github: '' },
        { name: 'Pranay Mune', year: '2nd', branch: 'CSE', role: 'Documentation', avatar: '/assets_committee/EI-Photo/Pranay%20Mune.jpg', uid: '25013120', isHead: false, isCoHead: false, tagline: 'Learning to build, building to learn', linkedin: 'https://www.linkedin.com/in/pranay-mune-40333338b', github: 'https://github.com/pranaymune04-sketch' },
        { name: 'Vaibhavi Purohit', year: '2nd', branch: 'Robotics and Artificial Intelligence', role: 'Documentation', avatar: '/assets_committee/EI-Photo/Vaibhavi.jpg', uid: '25012027', isHead: false, isCoHead: false, tagline: 'Turning Ideas into Impact, One Initiative at a Time.', linkedin: 'https://www.linkedin.com/in/vaibhavi-purohit-3b999b441', github: '' },
        { name: 'Lakshita Bisen', year: '2nd', branch: 'Information Technology', role: 'Documentation', avatar: '/assets_committee/EI-Photo/Lakshita%20Bisen.jpeg', uid: '25010032', isHead: false, isCoHead: false, tagline: 'Opportunities to Learn. Experiences to Grow.', linkedin: 'https://www.linkedin.com/in/lakshita-bisen-95ba183b4', github: 'https://github.com/lakshitabisen01' },
        { name: 'Jennifer Joseph', year: '3rd', branch: 'Information Technology', role: 'Documentation', avatar: '', uid: '24010002', isHead: false, isCoHead: false, tagline: '', linkedin: '', github: '' }
      ]
    },
    {
      id: 'event-management',
      domain_name: 'Event Management',
      short_name: 'Event Mgmt.',
      description: 'Directing logistics, crowd navigation, venue infrastructure, and interactive attendee operations.',
      icon: 'fa-users-gear',
      badge_color: '#ec4899',
      leader_name: 'Vishwaja Pinjarkar',
      leader_title: 'Event Management Head',
      leader_avatar: '',
      leader_year: '3rd',
      leader_branch: 'Electronics and Telecommunication',
      leader_uid: '24008968',
      teammates: JSON.stringify([
        { name: 'Bhavesh Gotmare', year: '2nd', branch: 'Civil', role: 'Event Management Co-head', avatar: '', uid: '25002023', isCoHead: true },
        { name: 'Vedant Nasare', year: '2nd', branch: 'Information Technology', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Vedant%20Nasare.png', uid: '25010007' },
        { name: 'Jai Sagulale', year: '2nd', branch: 'Artificial Intelligence', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Jai%20Sagulale.png', uid: '25001048' },
        { name: 'Tejasvi Bondre', year: '2nd', branch: 'Electrical', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Tejasvi%20Bondre.jpg', uid: '25007031' },
        { name: 'Sharwari Lohakare', year: '3rd', branch: 'Information Technology', role: 'Event Management', avatar: '', uid: '24010062' },
        { name: 'Charvi Mohite', year: '3rd', branch: 'Information Technology', role: 'Event Management', avatar: '', uid: '24010059' },
        { name: 'Arshpreet Kaur Sandhu', year: '2nd', branch: 'Electrical', role: 'Event Management', avatar: '/assets_committee/EI-Photo/arshpreet.jpg', uid: '25007028' },
        { name: 'Aditya Devhare', year: '2nd', branch: 'Artificial Intelligence', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Aditya%20Devhare.jpeg', uid: '25001056' },
        { name: 'Chaitanya Lambat', year: '2nd', branch: 'Artificial Intelligence', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Chaitanya%20Lambat.jpg', uid: '25001023' },
        { name: 'Tanmay Gudadhe', year: '2nd', branch: 'Data Science', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Tanmay%20Gudadhe..png.jpeg', uid: '25006036' },
        { name: 'Purva Gadkari', year: '2nd', branch: 'Data Science', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Purva%20Gadkari.jpeg', uid: '25006027' },
        { name: 'Ankush Gawate', year: '2nd', branch: 'Electrical Engineering', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Ankush%20Gawate_.jpg', uid: '25007025' },
        { name: 'Srushti Shahade', year: '2nd', branch: 'Artificial Intelligence', role: 'Event Management', avatar: '', uid: '25001026' }
      ]),
      members: [
        { name: 'Vishwaja Pinjarkar', year: '3rd', branch: 'Electronics and Telecommunication', role: 'Event Management Head', avatar: '', uid: '24008968', isHead: true, isCoHead: false, tagline: 'Too curious to overlook, too creative to copy, too particular to settle.', linkedin: 'https://www.linkedin.com/in/vishwaja-pinjarkar/', github: 'https://github.com/v1shwaja' },
        { name: 'Bhavesh Gotmare', year: '2nd', branch: 'Civil', role: 'Event Management Co-head', avatar: '', uid: '25002023', isHead: false, isCoHead: true, tagline: 'Sketching the future, building the foundation', linkedin: 'https://www.linkedin.com/in/bhavesh-gotmare-8104ab42a', github: '' },
        { name: 'Vedant Nasare', year: '2nd', branch: 'Information Technology', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Vedant%20Nasare.png', uid: '25010007', isHead: false, isCoHead: false, tagline: 'Turning Small Efforts into Bigger Impact', linkedin: 'https://www.linkedin.com/in/vedant-nasare-24b6393b1/', github: 'https://github.com/vedantnasare8-alt' },
        { name: 'Jai Sagulale', year: '2nd', branch: 'Artificial Intelligence', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Jai%20Sagulale.png', uid: '25001048', isHead: false, isCoHead: false, tagline: 'Too rare to be understood, too real to be forgotten.', linkedin: 'https://www.linkedin.com/in/jai-sagulale-8597383ab', github: 'https://github.com/jaisagulale18-png' },
        { name: 'Tejasvi Bondre', year: '2nd', branch: 'Electrical', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Tejasvi%20Bondre.jpg', uid: '25007031', isHead: false, isCoHead: false, tagline: 'Dreams to Goals, Goals to Achievements', linkedin: 'https://www.linkedin.com/in/tejasvi-bondre-9807abc', github: '' },
        { name: 'Sharwari Lohakare', year: '3rd', branch: 'Information Technology', role: 'Event Management', avatar: '', uid: '24010062', isHead: false, isCoHead: false, tagline: '', linkedin: '', github: '' },
        { name: 'Charvi Mohite', year: '3rd', branch: 'Information Technology', role: 'Event Management', avatar: '', uid: '24010059', isHead: false, isCoHead: false, tagline: '', linkedin: '', github: '' },
        { name: 'Arshpreet Kaur Sandhu', year: '2nd', branch: 'Electrical', role: 'Event Management', avatar: '/assets_committee/EI-Photo/arshpreet.jpg', uid: '25007028', isHead: false, isCoHead: false, tagline: 'Focused on growth, committed to excellence.', linkedin: 'https://www.linkedin.com/in/arshpreet-kaur-sandhu-1820843b0', github: '' },
        { name: 'Aditya Devhare', year: '2nd', branch: 'Artificial Intelligence', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Aditya%20Devhare.jpeg', uid: '25001056', isHead: false, isCoHead: false, tagline: 'Question Everything. Create Anything.', linkedin: 'https://www.linkedin.com/in/aditya-devhare-4570323b4/', github: 'https://github.com/Adityadevhare' },
        { name: 'Chaitanya Lambat', year: '2nd', branch: 'Artificial Intelligence', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Chaitanya%20Lambat.jpg', uid: '25001023', isHead: false, isCoHead: false, tagline: 'Everything is Impossible, Until someone does it.', linkedin: 'https://www.linkedin.com/in/chaitanya-lambat-a1aa46369/', github: 'https://github.com/Sai-1903-art' },
        { name: 'Tanmay Gudadhe', year: '2nd', branch: 'Data Science', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Tanmay%20Gudadhe..png.jpeg', uid: '25006036', isHead: false, isCoHead: false, tagline: 'Ye dil mange more', linkedin: 'https://www.linkedin.com/in/tanmay-gudadhe-3878902bb', github: 'https://github.com/tanmaygudadhe18-lang' },
        { name: 'Purva Gadkari', year: '2nd', branch: 'Data Science', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Purva%20Gadkari.jpeg', uid: '25006027', isHead: false, isCoHead: false, tagline: 'Turning ‘what if?’ into ‘why not?’', linkedin: 'https://www.linkedin.com/in/purva-gadkari-4696293b0/', github: 'https://github.com/purvagadkari10-pg' },
        { name: 'Ankush Gawate', year: '2nd', branch: 'Electrical Engineering', role: 'Event Management', avatar: '/assets_committee/EI-Photo/Ankush%20Gawate_.jpg', uid: '25007025', isHead: false, isCoHead: false, tagline: "♞♜♘There's still a best move how bad ur thing's ar", linkedin: 'https://www.linkedin.com/in/ankush-gawate-04621942b', github: '' },
        { name: 'Srushti Shahade', year: '2nd', branch: 'Artificial Intelligence', role: 'Event Management', avatar: '', uid: '25001026', isHead: false, isCoHead: false, tagline: '', linkedin: '', github: '' }
      ]
    },
    {
      id: 'media',
      domain_name: 'Media',
      short_name: 'Media',
      description: 'Creating high-impact visual media, creative videography, graphics, and live event coverage.',
      icon: 'fa-camera-retro',
      badge_color: '#f43f5e',
      leader_name: 'Ansh Samuel',
      leader_title: 'Media Head',
      leader_avatar: '',
      leader_year: '2nd',
      leader_branch: 'AI',
      leader_uid: '25001011',
      teammates: JSON.stringify([
        { name: 'Vinit Manoj Paturkar', year: '2nd', branch: 'Artificial Intelligence', role: 'Media Co-head', avatar: '/assets_committee/EI-Photo/Vinit%20Paturkar.jpg', uid: '25001025', isCoHead: true },
        { name: 'Suzan Francis', year: '2nd', branch: 'Computer Science and Engineering', role: 'Media', avatar: '/assets_committee/EI-Photo/Suzan%20Francis_.jpg', uid: '25013104' },
        { name: 'Ratan Ingle', year: '2nd', branch: 'Artificial Intelligence', role: 'Media', avatar: '/assets_committee/EI-Photo/Ratan%20Ingle.png', uid: '25001022' },
        { name: 'Soham Giradkar', year: '2nd', branch: 'Artificial Intelligence', role: 'Media', avatar: '/assets_committee/EI-Photo/Soham%20Giradkar.jpg', uid: '25001028' }
      ]),
      members: [
        { name: 'Ansh Samuel', year: '2nd', branch: 'Artificial Intelligence', role: 'Media Head', avatar: '', uid: '25001011', isHead: true, isCoHead: false, tagline: '', linkedin: '', github: '' },
        { name: 'Vinit Manoj Paturkar', year: '2nd', branch: 'Artificial Intelligence', role: 'Media Co-head', avatar: '/assets_committee/EI-Photo/Vinit%20Paturkar.jpg', uid: '25001025', isHead: false, isCoHead: true, tagline: 'Driven by Curiosity, Defined by Creativity.', linkedin: 'https://www.linkedin.com/in/vinit-paturkar/', github: 'https://github.com/Therock1037X' },
        { name: 'Suzan Francis', year: '2nd', branch: 'Computer Science and Engineering', role: 'Media', avatar: '/assets_committee/EI-Photo/Suzan%20Francis_.jpg', uid: '25013104', isHead: false, isCoHead: false, tagline: 'Romanticizing the journey, conquering the destination.', linkedin: 'https://www.linkedin.com/in/suzan-francis-96a19a3a7', github: '' },
        { name: 'Ratan Ingle', year: '2nd', branch: 'Artificial Intelligence', role: 'Media', avatar: '/assets_committee/EI-Photo/Ratan%20Ingle.png', uid: '25001022', isHead: false, isCoHead: false, tagline: '', linkedin: '', github: '' },
        { name: 'Soham Giradkar', year: '2nd', branch: 'Artificial Intelligence', role: 'Media', avatar: '/assets_committee/EI-Photo/Soham%20Giradkar.jpg', uid: '25001028', isHead: false, isCoHead: false, tagline: "As long as I'm alive, there are infinite chances!", linkedin: 'https://www.linkedin.com/in/soham-giradkar-106a07384', github: 'https://github.com/sohamgiradkar' }
      ]
    },
    {
      id: 'public-relations',
      domain_name: 'Public Relations (PR)',
      short_name: 'Public Relations',
      description: 'Facilitating campus outreach, public relations, community networking, and external collaborations.',
      icon: 'fa-bullhorn',
      badge_color: '#f59e0b',
      leader_name: 'Purva Mohature',
      leader_title: 'PR Head',
      leader_avatar: '',
      leader_year: '3rd',
      leader_branch: 'Data Science',
      leader_uid: '24006068',
      teammates: JSON.stringify([
        { name: 'Vaiga Nair', year: '3rd', branch: 'Electronics and Telecommunication', role: 'PR Co-head', avatar: '/assets_committee/EI-Photo/VaigaNair.jpeg', uid: '24008061', isCoHead: true },
        { name: 'Mrunali Sakharkar', year: '3rd', branch: 'Data Science', role: 'PR', avatar: '/assets_committee/EI-Photo/Mrunali%20Sakharkar%20.jpeg', uid: '25106002' },
        { name: 'Anushka Hirulkar', year: '2nd', branch: 'CSBS', role: 'PR', avatar: '', uid: '25005007' },
        { name: 'Shrawani Akre', year: '3rd', branch: 'Electronics and Telecommunication', role: 'PR', avatar: '/assets_committee/EI-Photo/Shrawani%20Akre.png', uid: '25108003' },
        { name: 'Trusha Dhole', year: '2nd', branch: 'Artificial Intelligence', role: 'PR', avatar: '/assets_committee/EI-Photo/Trusha_Dhole.jpeg', uid: '25001030' },
        { name: 'Aishita Balpande', year: '2nd', branch: 'Artificial Intelligence', role: 'PR', avatar: '/assets_committee/EI-Photo/Aishita_Balpande.jpg', uid: '25001040' }
      ]),
      members: [
        { name: 'Purva Mohature', year: '3rd', branch: 'Data Science', role: 'PR Head', avatar: '', uid: '24006068', isHead: true, isCoHead: false, tagline: '', linkedin: '', github: '' },
        { name: 'Vaiga Nair', year: '3rd', branch: 'Electronics and Telecommunication', role: 'PR Co-head', avatar: '/assets_committee/EI-Photo/VaigaNair.jpeg', uid: '24008061', isHead: false, isCoHead: true, tagline: '', linkedin: '', github: '' },
        { name: 'Mrunali Sakharkar', year: '3rd', branch: 'Data Science', role: 'PR', avatar: '/assets_committee/EI-Photo/Mrunali%20Sakharkar%20.jpeg', uid: '25106002', isHead: false, isCoHead: false, tagline: 'Curious enough to question. Bold enough to build.', linkedin: 'https://www.linkedin.com/in/mrunali-sakharkar-83b65242a', github: 'https://github.com/mrunali0248' },
        { name: 'Anushka Hirulkar', year: '2nd', branch: 'CSBS', role: 'PR', avatar: '', uid: '25005007', isHead: false, isCoHead: false, tagline: '', linkedin: '', github: '' },
        { name: 'Shrawani Akre', year: '3rd', branch: 'Electronics and Telecommunication', role: 'PR', avatar: '/assets_committee/EI-Photo/Shrawani%20Akre.png', uid: '25108003', isHead: false, isCoHead: false, tagline: 'Creating. Connecting. Evolving', linkedin: 'https://www.linkedin.com/in/shrawani-akre-578784267', github: '' },
        { name: 'Trusha Dhole', year: '2nd', branch: 'Artificial Intelligence', role: 'PR', avatar: '/assets_committee/EI-Photo/Trusha_Dhole.jpeg', uid: '25001030', isHead: false, isCoHead: false, tagline: 'Build by Ambition, forged by discipline.', linkedin: 'https://www.linkedin.com/in/trusha-dhole-190208382', github: 'https://github.com/trushadhole-hue' },
        { name: 'Aishita Balpande', year: '2nd', branch: 'Artificial Intelligence', role: 'PR', avatar: '/assets_committee/EI-Photo/Aishita_Balpande.jpg', uid: '25001040', isHead: false, isCoHead: false, tagline: 'Ideas with purpose, actions with impact.', linkedin: 'https://www.linkedin.com/in/aishita-balpande-5434b4386/', github: 'https://github.com/aishitabalpande13' }
      ]
    },
    {
      id: 'technical',
      domain_name: 'Technical',
      short_name: 'Technical',
      description: 'Developing digital systems, club web platforms, software solutions, and technical workshops.',
      icon: 'fa-code',
      badge_color: '#10b981',
      leader_name: 'Supreet Borikar',
      leader_title: 'Technical Head',
      leader_avatar: '/assets_committee/EI-Photo/Supreet%20Borikar.jpeg',
      leader_year: '3rd',
      leader_branch: 'Artificial Intelligence',
      leader_uid: '24001055',
      teammates: JSON.stringify([
        { name: 'Mayuri Atkar', year: '3rd', branch: 'Information Technology', role: 'Technical Co-Head', avatar: '/assets_committee/EI-Photo/mayuri_atkar.jpeg', uid: '24010020', isCoHead: true },
        { name: 'Anushka Mankar', year: '2nd', branch: 'Data Science', role: 'Technical', avatar: '/assets_committee/EI-Photo/Anushka%20Mankar.jpeg', uid: '25006018' },
        { name: 'Sharwari Dhandale', year: '2nd', branch: 'Artificial Intelligence', role: 'Technical', avatar: '/assets_committee/EI-Photo/Sharwari%20dhandale.jpeg', uid: '25001034' },
        { name: 'Parth Janai', year: '3rd', branch: 'Industrial IoT', role: 'Technical', avatar: '/assets_committee/EI-Photo/Parth%20Janai.png', uid: '25109007' },
        { name: 'Samruddhi Warudkar', year: '2nd', branch: 'Artificial Intelligence', role: 'Technical', avatar: '/assets_committee/EI-Photo/SAMRUDDHI%20WARUDKAR_.png', uid: '25001046' },
        { name: 'Priyal P. Raut', year: '2nd', branch: 'Artificial Intelligence', role: 'Technical', avatar: '/assets_committee/EI-Photo/Priyal_Raut.jpeg', uid: '25001013' },
        { name: 'Samiksha Hedaou', year: '3rd', branch: 'Electronics and Telecommunication', role: 'Technical', avatar: '/assets_committee/EI-Photo/samiksha_hedaou.jpeg', uid: '24008045' },
        { name: 'Sakshi Bute', year: '3rd', branch: 'Information Technology', role: 'Technical', avatar: '', uid: '24010002' }
      ]),
      members: [
        { name: 'Supreet Borikar', year: '3rd', branch: 'Artificial Intelligence', role: 'Technical Head', avatar: '/assets_committee/EI-Photo/Supreet%20Borikar.jpeg', uid: '24001055', isHead: true, isCoHead: false, tagline: '', linkedin: '', github: '' },
        { name: 'Mayuri Atkar', year: '3rd', branch: 'Information Technology', role: 'Technical Co-Head', avatar: '/assets_committee/EI-Photo/mayuri_atkar.jpeg', uid: '24010020', isHead: false, isCoHead: true, tagline: 'Growing through every version of me', linkedin: 'https://www.linkedin.com/in/mayuri-atkar-3913b6343', github: 'https://github.com/mayuriatkar5-lgtm' },
        { name: 'Anushka Mankar', year: '2nd', branch: 'Data Science', role: 'Technical', avatar: '/assets_committee/EI-Photo/Anushka%20Mankar.jpeg', uid: '25006018', isHead: false, isCoHead: false, tagline: 'Tastes like heaven, burns like hell', linkedin: 'https://www.linkedin.com/in/anushka-mankar-4378153aa/', github: 'https://github.com/anushkamankar49-dotcom' },
        { name: 'Sharwari Dhandale', year: '2nd', branch: 'Artificial Intelligence', role: 'Technical', avatar: '/assets_committee/EI-Photo/Sharwari%20dhandale.jpeg', uid: '25001034', isHead: false, isCoHead: false, tagline: 'Turning ambition into architecture', linkedin: 'https://www.linkedin.com/in/sharwari-dhandale-820a262b8', github: 'https://github.com/Sharwari-2007' },
        { name: 'Parth Janai', year: '3rd', branch: 'Industrial IoT', role: 'Technical', avatar: '/assets_committee/EI-Photo/Parth%20Janai.png', uid: '25109007', isHead: false, isCoHead: false, tagline: 'Creating today. Inspiring tomorrow', linkedin: 'https://www.linkedin.com/in/parth-janai-85569b334', github: 'https://github.com/parthjanai24-Master' },
        { name: 'Samruddhi Warudkar', year: '2nd', branch: 'Artificial Intelligence', role: 'Technical', avatar: '/assets_committee/EI-Photo/SAMRUDDHI%20WARUDKAR_.png', uid: '25001046', isHead: false, isCoHead: false, tagline: 'Rooted in calm, reaching for more.', linkedin: 'https://www.linkedin.com/in/samruddhi-warudkar-58752a393', github: 'https://github.com/samruddhiwarudkar577-prog' },
        { name: 'Priyal P. Raut', year: '2nd', branch: 'Artificial Intelligence', role: 'Technical', avatar: '/assets_committee/EI-Photo/Priyal_Raut.jpeg', uid: '25001013', isHead: false, isCoHead: false, tagline: 'Curious by Nature, Relentless by Choice', linkedin: 'https://www.linkedin.com/in/priyal-raut-30283937b', github: 'https://github.com/priyalraut703' },
        { name: 'Samiksha Hedaou', year: '3rd', branch: 'Electronics and Telecommunication', role: 'Technical', avatar: '/assets_committee/EI-Photo/samiksha_hedaou.jpeg', uid: '24008045', isHead: false, isCoHead: false, tagline: 'Curious. Unfiltered. Becoming.', linkedin: 'https://www.linkedin.com/in/samiksha-hedaou', github: 'https://github.com/Samiksha-tech-e/On-mobile-vibe-coding-/tree/main' },
        { name: 'Sakshi Bute', year: '3rd', branch: 'Information Technology', role: 'Technical', avatar: '', uid: '24010002', isHead: false, isCoHead: false, tagline: '', linkedin: '', github: '' }
      ]
    }
  ];

  // Sync domains
  db.prepare('DELETE FROM committee_domains').run();
  const insertDomain = db.prepare(`
    INSERT INTO committee_domains (id, domain_name, short_name, description, icon, badge_color, leader_name, leader_title, leader_avatar, leader_year, leader_branch, leader_uid, teammates)
    VALUES (@id, @domain_name, @short_name, @description, @icon, @badge_color, @leader_name, @leader_title, @leader_avatar, @leader_year, @leader_branch, @leader_uid, @teammates)
  `);

  for (const dom of officialCommitteeDomains) {
    insertDomain.run({
      id: dom.id,
      domain_name: dom.domain_name,
      short_name: dom.short_name,
      description: dom.description || '',
      icon: dom.icon,
      badge_color: dom.badge_color,
      leader_name: dom.leader_name,
      leader_title: dom.leader_title,
      leader_avatar: dom.leader_avatar,
      leader_year: dom.leader_year,
      leader_branch: dom.leader_branch,
      leader_uid: dom.leader_uid,
      teammates: dom.teammates
    });
  }

  // Sync committee members (all 48 official members)
  db.prepare('DELETE FROM committee_members').run();
  const insertMember = db.prepare(`
    INSERT INTO committee_members (domain_id, name, role, year, branch, uid, avatar, is_head, is_co_head, linkedin, github, tagline)
    VALUES (@domain_id, @name, @role, @year, @branch, @uid, @avatar, @is_head, @is_co_head, @linkedin, @github, @tagline)
  `);

  for (const dom of officialCommitteeDomains) {
    for (const m of dom.members) {
      insertMember.run({
        domain_id: dom.id,
        name: m.name,
        role: m.role,
        year: m.year,
        branch: m.branch,
        uid: m.uid || '',
        avatar: m.avatar || '',
        is_head: m.isHead ? 1 : 0,
        is_co_head: m.isCoHead ? 1 : 0,
        linkedin: m.linkedin || '',
        github: m.github || '',
        tagline: m.tagline || ''
      });
    }
  }

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
