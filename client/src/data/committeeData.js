// Official Engineering India - SVPCET Executive Committee Data
// Single Source of Truth for 6 Official Domains & 48 Roster Members

// URL Normalization Helpers
export const normalizeLinkedInUrl = (url = '') => {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim();
  if (!trimmed || trimmed.toLowerCase() === 'not supplied' || trimmed.toLowerCase() === 'n/a' || trimmed.toLowerCase() === 'none') {
    return '';
  }
  trimmed = trimmed.replace(/\?+$/, '');
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('www.')) {
    return `https://${trimmed}`;
  }
  if (trimmed.startsWith('linkedin.com')) {
    return `https://${trimmed}`;
  }
  if (trimmed.startsWith('in/')) {
    return `https://www.linkedin.com/${trimmed}`;
  }
  return `https://www.linkedin.com/in/${trimmed}`;
};

export const normalizeGitHubUrl = (url = '') => {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim();
  if (!trimmed || trimmed.toLowerCase() === 'not supplied' || trimmed.toLowerCase() === 'n/a' || trimmed.toLowerCase() === 'none') {
    return '';
  }
  trimmed = trimmed.replace(/\?+$/, '');
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('www.')) {
    return `https://${trimmed}`;
  }
  if (trimmed.startsWith('github.com/')) {
    return `https://${trimmed}`;
  }
  return `https://github.com/${trimmed}`;
};

// Known Name Aliases for cross-dataset reconciliation
export const NAME_ALIASES = {
  'arshpreet sandhu': 'Arshpreet Kaur Sandhu',
  'arshpreet kaur sandhu': 'Arshpreet Kaur Sandhu',
  'palak v. dongre': 'Palak Dongre',
  'palak v dongre': 'Palak Dongre',
  'palak dongre': 'Palak Dongre',
  'trusha r. dhole': 'Trusha Dhole',
  'trusha r dhole': 'Trusha Dhole',
  'trusha dhole': 'Trusha Dhole',
  'vinit paturkar': 'Vinit Manoj Paturkar',
  'vinit manoj paturkar': 'Vinit Manoj Paturkar',
  'priyal raut': 'Priyal P. Raut',
  'priyal p. raut': 'Priyal P. Raut',
  'samiksha hedaou': 'Samiksha Hedaou',
  'shrawani akre': 'Shrawani Akre',
  'mrunmayee chaudhrai': 'Mrunmayee Chaudhari',
  'antariksh pilare': 'Antariksh Pilare',
  'vaibhavi': 'Vaibhavi Purohit'
};

// Centralized Member Photograph Mapping (Verified against client/public/assets_committee/EI-Photo/)
export const COMMITTEE_PHOTO_MAP = {
  // Secretary
  'Vedant Chamat': '/assets_committee/EI-Photo/Vedant%20Chamat.jpeg',
  'Mrunmayee Chaudhari': '/assets_committee/EI-Photo/Mrunmayee%20Chaudhrai.jpeg',

  // Documentation
  'Roopam Zade': '/assets_committee/EI-Photo/Roopam_Zade.png',
  'Hariom Shrinath': '/assets_committee/EI-Photo/Hariom%20Shrinath.jpg',
  'Pranay Mune': '/assets_committee/EI-Photo/Pranay%20Mune.jpg',
  'Vaibhavi Purohit': '/assets_committee/EI-Photo/Vaibhavi.jpg',
  'Lakshita Bisen': '/assets_committee/EI-Photo/Lakshita%20Bisen.jpeg',

  // Event Management
  'Vedant Nasare': '/assets_committee/EI-Photo/Vedant%20Nasare.png',
  'Jai Sagulale': '/assets_committee/EI-Photo/Jai%20Sagulale.png',
  'Tejasvi Bondre': '/assets_committee/EI-Photo/Tejasvi%20Bondre.jpg',
  'Arshpreet Kaur Sandhu': '/assets_committee/EI-Photo/arshpreet.jpg',
  'Aditya Devhare': '/assets_committee/EI-Photo/Aditya%20Devhare.jpeg',
  'Chaitanya Lambat': '/assets_committee/EI-Photo/Chaitanya%20Lambat.jpg',
  'Tanmay Gudadhe': '/assets_committee/EI-Photo/Tanmay%20Gudadhe..png.jpeg',
  'Purva Gadkari': '/assets_committee/EI-Photo/Purva%20Gadkari.jpeg',
  'Ankush Gawate': '/assets_committee/EI-Photo/Ankush%20Gawate_.jpg',

  // Media
  'Vinit Manoj Paturkar': '/assets_committee/EI-Photo/Vinit%20Paturkar.jpg',
  'Suzan Francis': '/assets_committee/EI-Photo/Suzan%20Francis_.jpg',
  'Ratan Ingle': '/assets_committee/EI-Photo/Ratan%20Ingle.png',
  'Soham Giradkar': '/assets_committee/EI-Photo/Soham%20Giradkar.jpg',

  // Public Relations (PR)
  'Vaiga Nair': '/assets_committee/EI-Photo/VaigaNair.jpeg',
  'Mrunali Sakharkar': '/assets_committee/EI-Photo/Mrunali%20Sakharkar%20.jpeg',
  'Shrawani Akre': '/assets_committee/EI-Photo/Shrawani%20Akre.png',
  'Trusha Dhole': '/assets_committee/EI-Photo/Trusha_Dhole.jpeg',
  'Aishita Balpande': '/assets_committee/EI-Photo/Aishita_Balpande.jpg',

  // Technical
  'Supreet Borikar': '/assets_committee/EI-Photo/Supreet%20Borikar.jpeg',
  'Mayuri Atkar': '/assets_committee/EI-Photo/mayuri_atkar.jpeg',
  'Anushka Mankar': '/assets_committee/EI-Photo/Anushka%20Mankar.jpeg',
  'Sharwari Dhandale': '/assets_committee/EI-Photo/Sharwari%20dhandale.jpeg',
  'Parth Janai': '/assets_committee/EI-Photo/Parth%20Janai.png',
  'Samruddhi Warudkar': '/assets_committee/EI-Photo/SAMRUDDHI%20WARUDKAR_.png',
  'Priyal P. Raut': '/assets_committee/EI-Photo/Priyal_Raut.jpeg',
  'Samiksha Hedaou': '/assets_committee/EI-Photo/samiksha_hedaou.jpeg',

  // Unresolved
  'Yadni Zade': '/assets_committee/EI-Photo/yadni%20zade.png'
};

// Helper to look up member photo by name with alias support
export const getMemberPhoto = (name = '') => {
  if (!name) return '';
  const trimmed = name.trim();
  if (COMMITTEE_PHOTO_MAP[trimmed]) return COMMITTEE_PHOTO_MAP[trimmed];
  const normalized = NAME_ALIASES[trimmed.toLowerCase()] || trimmed;
  if (COMMITTEE_PHOTO_MAP[normalized]) return COMMITTEE_PHOTO_MAP[normalized];
  return '';
};

// 6 Official Committee Domains and their 48 Authoritative Members
export const OFFICIAL_COMMITTEE_DOMAINS = [
  {
    id: 'secretary',
    domainName: 'Secretary',
    shortName: 'Secretariat',
    description: 'Managing committee governance, official documentation, record keeping, and student body administration.',
    icon: 'fa-file-signature',
    badgeColor: '#6366f1',
    memberCount: 4,
    head: {
      id: 'sec-1',
      name: 'Vedant Chamat',
      role: 'Secretary',
      year: '3rd',
      branch: 'Industrial IoT',
      uid: '24009033',
      avatar: '/assets_committee/EI-Photo/Vedant%20Chamat.jpeg',
      photo: '/assets_committee/EI-Photo/Vedant%20Chamat.jpeg',
      isHead: true,
      isCoHead: false,
      tagline: 'A BOY WITH A DREAM.',
      github: '',
      linkedin: 'https://www.linkedin.com/in/vedant-chamat-9989ab328'
    },
    members: [
      {
        id: 'sec-1',
        name: 'Vedant Chamat',
        role: 'Secretary',
        year: '3rd',
        branch: 'Industrial IoT',
        uid: '24009033',
        avatar: '/assets_committee/EI-Photo/Vedant%20Chamat.jpeg',
        photo: '/assets_committee/EI-Photo/Vedant%20Chamat.jpeg',
        isHead: true,
        isCoHead: false,
        tagline: 'A BOY WITH A DREAM.',
        github: '',
        linkedin: 'https://www.linkedin.com/in/vedant-chamat-9989ab328'
      },
      {
        id: 'sec-2',
        name: 'Mrunmayee Chaudhari',
        role: 'Secretary',
        year: '3rd',
        branch: 'Information Technology',
        uid: '24010060',
        avatar: '/assets_committee/EI-Photo/Mrunmayee%20Chaudhrai.jpeg',
        photo: '/assets_committee/EI-Photo/Mrunmayee%20Chaudhrai.jpeg',
        isHead: false,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      },
      {
        id: 'sec-3',
        name: 'Nimish Chamat',
        role: 'Secretary',
        year: '3rd',
        branch: 'Civil Engineering',
        uid: '24002023',
        avatar: '',
        photo: '',
        isHead: false,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      },
      {
        id: 'sec-4',
        name: 'Palak Dongre',
        role: 'Secretary',
        year: '3rd',
        branch: 'Electronics and Telecommunication',
        uid: '24008055',
        avatar: '',
        photo: '',
        isHead: false,
        isCoHead: false,
        tagline: 'Welcome To MULTIVERSE OF MADNESS!!!',
        github: '',
        linkedin: 'https://www.linkedin.com/in/palakdongre05'
      }
    ]
  },
  {
    id: 'documentation',
    domainName: 'Documentation',
    shortName: 'Documentation',
    description: 'Overseeing technical reporting, event dossiers, research archives, and official communications.',
    icon: 'fa-file-lines',
    badgeColor: '#8b5cf6',
    memberCount: 9,
    head: {
      id: 'doc-1',
      name: 'Apurva Mohite',
      role: 'Documentation Head',
      year: '3rd',
      branch: 'Industrial IoT',
      uid: '24009038',
      avatar: '',
      photo: '',
      isHead: true,
      isCoHead: false,
      tagline: '',
      github: '',
      linkedin: 'https://www.linkedin.com/in/apurva-mohite-24b869332'
    },
    members: [
      {
        id: 'doc-1',
        name: 'Apurva Mohite',
        role: 'Documentation Head',
        year: '3rd',
        branch: 'Industrial IoT',
        uid: '24009038',
        avatar: '',
        photo: '',
        isHead: true,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: 'https://www.linkedin.com/in/apurva-mohite-24b869332'
      },
      {
        id: 'doc-2',
        name: 'Roopam Zade',
        role: 'Documentation Co-head',
        year: '3rd',
        branch: 'Industrial IoT',
        uid: '24009041',
        avatar: '/assets_committee/EI-Photo/Roopam_Zade.png',
        photo: '/assets_committee/EI-Photo/Roopam_Zade.png',
        isHead: false,
        isCoHead: true,
        tagline: 'Still figuring it out. Still moving forward.',
        github: 'https://github.com/roopamzade1902-tech',
        linkedin: 'https://www.linkedin.com/in/roopam-zade-1a32b13b6'
      },
      {
        id: 'doc-3',
        name: 'Ayush Chauhan',
        role: 'Documentation',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001043',
        avatar: '',
        photo: '',
        isHead: false,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      },
      {
        id: 'doc-4',
        name: 'Hariom Shrinath',
        role: 'Documentation',
        year: '3rd',
        branch: 'Electronics and Telecommunication',
        uid: '25108006',
        avatar: '/assets_committee/EI-Photo/Hariom%20Shrinath.jpg',
        photo: '/assets_committee/EI-Photo/Hariom%20Shrinath.jpg',
        isHead: false,
        isCoHead: false,
        tagline: 'Work in silence. Let progress speak.',
        github: '',
        linkedin: 'https://www.linkedin.com/in/hariom-shrinath-a579693a1/'
      },
      {
        id: 'doc-5',
        name: 'Antariksh Pilare',
        role: 'Documentation',
        year: '2nd',
        branch: 'Civil',
        uid: '25002050',
        avatar: '',
        photo: '',
        isHead: false,
        isCoHead: false,
        tagline: 'Courage in the heart, fire in the soul.',
        github: '',
        linkedin: 'https://www.linkedin.com/in/antariksh-pilare-a763a437b'
      },
      {
        id: 'doc-6',
        name: 'Pranay Mune',
        role: 'Documentation',
        year: '2nd',
        branch: 'CSE',
        uid: '25013120',
        avatar: '/assets_committee/EI-Photo/Pranay%20Mune.jpg',
        photo: '/assets_committee/EI-Photo/Pranay%20Mune.jpg',
        isHead: false,
        isCoHead: false,
        tagline: 'Learning to build, building to learn',
        github: 'https://github.com/pranaymune04-sketch',
        linkedin: 'https://www.linkedin.com/in/pranay-mune-40333338b'
      },
      {
        id: 'doc-7',
        name: 'Vaibhavi Purohit',
        role: 'Documentation',
        year: '2nd',
        branch: 'Robotics and Artificial Intelligence',
        uid: '25012027',
        avatar: '/assets_committee/EI-Photo/Vaibhavi.jpg',
        photo: '/assets_committee/EI-Photo/Vaibhavi.jpg',
        isHead: false,
        isCoHead: false,
        tagline: 'Turning Ideas into Impact, One Initiative at a Time.',
        github: '',
        linkedin: 'https://www.linkedin.com/in/vaibhavi-purohit-3b999b441'
      },
      {
        id: 'doc-8',
        name: 'Lakshita Bisen',
        role: 'Documentation',
        year: '2nd',
        branch: 'Information Technology',
        uid: '25010032',
        avatar: '/assets_committee/EI-Photo/Lakshita%20Bisen.jpeg',
        photo: '/assets_committee/EI-Photo/Lakshita%20Bisen.jpeg',
        isHead: false,
        isCoHead: false,
        tagline: 'Opportunities to Learn. Experiences to Grow.',
        github: 'https://github.com/lakshitabisen01',
        linkedin: 'https://www.linkedin.com/in/lakshita-bisen-95ba183b4'
      },
      {
        id: 'doc-9',
        name: 'Jennifer Joseph',
        role: 'Documentation',
        year: '3rd',
        branch: 'Information Technology',
        uid: '24010002',
        avatar: '',
        photo: '',
        isHead: false,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      }
    ]
  },
  {
    id: 'event-management',
    domainName: 'Event Management',
    shortName: 'Event Mgmt.',
    description: 'Directing logistics, crowd navigation, venue infrastructure, and interactive attendee operations.',
    icon: 'fa-users-gear',
    badgeColor: '#ec4899',
    memberCount: 14,
    head: {
      id: 'em-1',
      name: 'Vishwaja Pinjarkar',
      role: 'Event Management Head',
      year: '3rd',
      branch: 'Electronics and Telecommunication',
      uid: '24008968',
      avatar: '',
      photo: '',
      isHead: true,
      isCoHead: false,
      tagline: 'Too curious to overlook, too creative to copy, too particular to settle.',
      github: 'https://github.com/v1shwaja',
      linkedin: 'https://www.linkedin.com/in/vishwaja-pinjarkar/'
    },
    members: [
      {
        id: 'em-1',
        name: 'Vishwaja Pinjarkar',
        role: 'Event Management Head',
        year: '3rd',
        branch: 'Electronics and Telecommunication',
        uid: '24008968',
        avatar: '',
        photo: '',
        isHead: true,
        isCoHead: false,
        tagline: 'Too curious to overlook, too creative to copy, too particular to settle.',
        github: 'https://github.com/v1shwaja',
        linkedin: 'https://www.linkedin.com/in/vishwaja-pinjarkar/'
      },
      {
        id: 'em-2',
        name: 'Bhavesh Gotmare',
        role: 'Event Management Co-head',
        year: '2nd',
        branch: 'Civil',
        uid: '25002023',
        avatar: '',
        photo: '',
        isHead: false,
        isCoHead: true,
        tagline: 'Sketching the future, building the foundation',
        github: '',
        linkedin: 'https://www.linkedin.com/in/bhavesh-gotmare-8104ab42a'
      },
      {
        id: 'em-3',
        name: 'Vedant Nasare',
        role: 'Event Management',
        year: '2nd',
        branch: 'Information Technology',
        uid: '25010007',
        avatar: '/assets_committee/EI-Photo/Vedant%20Nasare.png',
        photo: '/assets_committee/EI-Photo/Vedant%20Nasare.png',
        isHead: false,
        isCoHead: false,
        tagline: 'Turning Small Efforts into Bigger Impact',
        github: 'https://github.com/vedantnasare8-alt',
        linkedin: 'https://www.linkedin.com/in/vedant-nasare-24b6393b1/'
      },
      {
        id: 'em-4',
        name: 'Jai Sagulale',
        role: 'Event Management',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001048',
        avatar: '/assets_committee/EI-Photo/Jai%20Sagulale.png',
        photo: '/assets_committee/EI-Photo/Jai%20Sagulale.png',
        isHead: false,
        isCoHead: false,
        tagline: 'Too rare to be understood, too real to be forgotten.',
        github: 'https://github.com/jaisagulale18-png',
        linkedin: 'https://www.linkedin.com/in/jai-sagulale-8597383ab'
      },
      {
        id: 'em-5',
        name: 'Tejasvi Bondre',
        role: 'Event Management',
        year: '2nd',
        branch: 'Electrical',
        uid: '25007031',
        avatar: '/assets_committee/EI-Photo/Tejasvi%20Bondre.jpg',
        photo: '/assets_committee/EI-Photo/Tejasvi%20Bondre.jpg',
        isHead: false,
        isCoHead: false,
        tagline: 'Dreams to Goals, Goals to Achievements',
        github: '',
        linkedin: 'https://www.linkedin.com/in/tejasvi-bondre-9807abc'
      },
      {
        id: 'em-6',
        name: 'Sharwari Lohakare',
        role: 'Event Management',
        year: '3rd',
        branch: 'Information Technology',
        uid: '24010062',
        avatar: '',
        photo: '',
        isHead: false,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      },
      {
        id: 'em-7',
        name: 'Charvi Mohite',
        role: 'Event Management',
        year: '3rd',
        branch: 'Information Technology',
        uid: '24010059',
        avatar: '',
        photo: '',
        isHead: false,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      },
      {
        id: 'em-8',
        name: 'Arshpreet Kaur Sandhu',
        role: 'Event Management',
        year: '2nd',
        branch: 'Electrical',
        uid: '25007028',
        avatar: '/assets_committee/EI-Photo/arshpreet.jpg',
        photo: '/assets_committee/EI-Photo/arshpreet.jpg',
        isHead: false,
        isCoHead: false,
        tagline: 'Focused on growth, committed to excellence.',
        github: '',
        linkedin: 'https://www.linkedin.com/in/arshpreet-kaur-sandhu-1820843b0'
      },
      {
        id: 'em-9',
        name: 'Aditya Devhare',
        role: 'Event Management',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001056',
        avatar: '/assets_committee/EI-Photo/Aditya%20Devhare.jpeg',
        photo: '/assets_committee/EI-Photo/Aditya%20Devhare.jpeg',
        isHead: false,
        isCoHead: false,
        tagline: 'Question Everything. Create Anything.',
        github: 'https://github.com/Adityadevhare',
        linkedin: 'https://www.linkedin.com/in/aditya-devhare-4570323b4/'
      },
      {
        id: 'em-10',
        name: 'Chaitanya Lambat',
        role: 'Event Management',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001023',
        avatar: '/assets_committee/EI-Photo/Chaitanya%20Lambat.jpg',
        photo: '/assets_committee/EI-Photo/Chaitanya%20Lambat.jpg',
        isHead: false,
        isCoHead: false,
        tagline: 'Everything is Impossible, Until someone does it.',
        github: 'https://github.com/Sai-1903-art',
        linkedin: 'https://www.linkedin.com/in/chaitanya-lambat-a1aa46369/'
      },
      {
        id: 'em-11',
        name: 'Tanmay Gudadhe',
        role: 'Event Management',
        year: '2nd',
        branch: 'Data Science',
        uid: '25006036',
        avatar: '/assets_committee/EI-Photo/Tanmay%20Gudadhe..png.jpeg',
        photo: '/assets_committee/EI-Photo/Tanmay%20Gudadhe..png.jpeg',
        isHead: false,
        isCoHead: false,
        tagline: 'Ye dil mange more',
        github: 'https://github.com/tanmaygudadhe18-lang',
        linkedin: 'https://www.linkedin.com/in/tanmay-gudadhe-3878902bb'
      },
      {
        id: 'em-12',
        name: 'Purva Gadkari',
        role: 'Event Management',
        year: '2nd',
        branch: 'Data Science',
        uid: '25006027',
        avatar: '/assets_committee/EI-Photo/Purva%20Gadkari.jpeg',
        photo: '/assets_committee/EI-Photo/Purva%20Gadkari.jpeg',
        isHead: false,
        isCoHead: false,
        tagline: 'Turning ‘what if?’ into ‘why not?’',
        github: 'https://github.com/purvagadkari10-pg',
        linkedin: 'https://www.linkedin.com/in/purva-gadkari-4696293b0/'
      },
      {
        id: 'em-13',
        name: 'Ankush Gawate',
        role: 'Event Management',
        year: '2nd',
        branch: 'Electrical Engineering',
        uid: '25007025',
        avatar: '/assets_committee/EI-Photo/Ankush%20Gawate_.jpg',
        photo: '/assets_committee/EI-Photo/Ankush%20Gawate_.jpg',
        isHead: false,
        isCoHead: false,
        tagline: "♞♜♘There's still a best move how bad ur thing's ar",
        github: '',
        linkedin: 'https://www.linkedin.com/in/ankush-gawate-04621942b'
      },
      {
        id: 'em-14',
        name: 'Srushti Shahade',
        role: 'Event Management',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001026',
        avatar: '',
        photo: '',
        isHead: false,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      }
    ]
  },
  {
    id: 'media',
    domainName: 'Media',
    shortName: 'Media',
    description: 'Creating high-impact visual media, creative videography, graphics, and live event coverage.',
    icon: 'fa-camera-retro',
    badgeColor: '#f43f5e',
    memberCount: 5,
    head: {
      id: 'med-1',
      name: 'Ansh Samuel',
      role: 'Media Head',
      year: '2nd',
      branch: 'Artificial Intelligence',
      uid: '25001011',
      avatar: '',
      photo: '',
      isHead: true,
      isCoHead: false,
      tagline: '',
      github: '',
      linkedin: ''
    },
    members: [
      {
        id: 'med-1',
        name: 'Ansh Samuel',
        role: 'Media Head',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001011',
        avatar: '',
        photo: '',
        isHead: true,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      },
      {
        id: 'med-2',
        name: 'Vinit Manoj Paturkar',
        role: 'Media Co-head',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001025',
        avatar: '/assets_committee/EI-Photo/Vinit%20Paturkar.jpg',
        photo: '/assets_committee/EI-Photo/Vinit%20Paturkar.jpg',
        isHead: false,
        isCoHead: true,
        tagline: 'Driven by Curiosity, Defined by Creativity.',
        github: 'https://github.com/Therock1037X',
        linkedin: 'https://www.linkedin.com/in/vinit-paturkar/'
      },
      {
        id: 'med-3',
        name: 'Suzan Francis',
        role: 'Media',
        year: '2nd',
        branch: 'Computer Science and Engineering',
        uid: '25013104',
        avatar: '/assets_committee/EI-Photo/Suzan%20Francis_.jpg',
        photo: '/assets_committee/EI-Photo/Suzan%20Francis_.jpg',
        isHead: false,
        isCoHead: false,
        tagline: 'Romanticizing the journey, conquering the destination.',
        github: '',
        linkedin: 'https://www.linkedin.com/in/suzan-francis-96a19a3a7'
      },
      {
        id: 'med-4',
        name: 'Ratan Ingle',
        role: 'Media',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001022',
        avatar: '/assets_committee/EI-Photo/Ratan%20Ingle.png',
        photo: '/assets_committee/EI-Photo/Ratan%20Ingle.png',
        isHead: false,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      },
      {
        id: 'med-5',
        name: 'Soham Giradkar',
        role: 'Media',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001028',
        avatar: '/assets_committee/EI-Photo/Soham%20Giradkar.jpg',
        photo: '/assets_committee/EI-Photo/Soham%20Giradkar.jpg',
        isHead: false,
        isCoHead: false,
        tagline: "As long as I'm alive, there are infinite chances!",
        github: 'https://github.com/sohamgiradkar',
        linkedin: 'https://www.linkedin.com/in/soham-giradkar-106a07384'
      }
    ]
  },
  {
    id: 'public-relations',
    domainName: 'Public Relations (PR)',
    shortName: 'Public Relations',
    description: 'Facilitating campus outreach, public relations, community networking, and external collaborations.',
    icon: 'fa-bullhorn',
    badgeColor: '#f59e0b',
    memberCount: 7,
    head: {
      id: 'pr-1',
      name: 'Purva Mohature',
      role: 'PR Head',
      year: '3rd',
      branch: 'Data Science',
      uid: '24006068',
      avatar: '',
      photo: '',
      isHead: true,
      isCoHead: false,
      tagline: '',
      github: '',
      linkedin: ''
    },
    members: [
      {
        id: 'pr-1',
        name: 'Purva Mohature',
        role: 'PR Head',
        year: '3rd',
        branch: 'Data Science',
        uid: '24006068',
        avatar: '',
        photo: '',
        isHead: true,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      },
      {
        id: 'pr-2',
        name: 'Vaiga Nair',
        role: 'PR Co-head',
        year: '3rd',
        branch: 'Electronics and Telecommunication',
        uid: '24008061',
        avatar: '/assets_committee/EI-Photo/VaigaNair.jpeg',
        photo: '/assets_committee/EI-Photo/VaigaNair.jpeg',
        isHead: false,
        isCoHead: true,
        tagline: '',
        github: '',
        linkedin: ''
      },
      {
        id: 'pr-3',
        name: 'Mrunali Sakharkar',
        role: 'PR',
        year: '3rd',
        branch: 'Data Science',
        uid: '25106002',
        avatar: '/assets_committee/EI-Photo/Mrunali%20Sakharkar%20.jpeg',
        photo: '/assets_committee/EI-Photo/Mrunali%20Sakharkar%20.jpeg',
        isHead: false,
        isCoHead: false,
        tagline: 'Curious enough to question. Bold enough to build.',
        github: 'https://github.com/mrunali0248',
        linkedin: 'https://www.linkedin.com/in/mrunali-sakharkar-83b65242a'
      },
      {
        id: 'pr-4',
        name: 'Anushka Hirulkar',
        role: 'PR',
        year: '2nd',
        branch: 'CSBS',
        uid: '25005007',
        avatar: '',
        photo: '',
        isHead: false,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      },
      {
        id: 'pr-5',
        name: 'Shrawani Akre',
        role: 'PR',
        year: '3rd',
        branch: 'Electronics and Telecommunication',
        uid: '25108003',
        avatar: '/assets_committee/EI-Photo/Shrawani%20Akre.png',
        photo: '/assets_committee/EI-Photo/Shrawani%20Akre.png',
        isHead: false,
        isCoHead: false,
        tagline: 'Creating. Connecting. Evolving',
        github: '',
        linkedin: 'https://www.linkedin.com/in/shrawani-akre-578784267'
      },
      {
        id: 'pr-6',
        name: 'Trusha Dhole',
        role: 'PR',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001030',
        avatar: '/assets_committee/EI-Photo/Trusha_Dhole.jpeg',
        photo: '/assets_committee/EI-Photo/Trusha_Dhole.jpeg',
        isHead: false,
        isCoHead: false,
        tagline: 'Build by Ambition, forged by discipline.',
        github: 'https://github.com/trushadhole-hue',
        linkedin: 'https://www.linkedin.com/in/trusha-dhole-190208382'
      },
      {
        id: 'pr-7',
        name: 'Aishita Balpande',
        role: 'PR',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001040',
        avatar: '/assets_committee/EI-Photo/Aishita_Balpande.jpg',
        photo: '/assets_committee/EI-Photo/Aishita_Balpande.jpg',
        isHead: false,
        isCoHead: false,
        tagline: 'Ideas with purpose, actions with impact.',
        github: 'https://github.com/aishitabalpande13',
        linkedin: 'https://www.linkedin.com/in/aishita-balpande-5434b4386/'
      }
    ]
  },
  {
    id: 'technical',
    domainName: 'Technical',
    shortName: 'Technical',
    description: 'Developing digital systems, club web platforms, software solutions, and technical workshops.',
    icon: 'fa-code',
    badgeColor: '#10b981',
    memberCount: 9,
    head: {
      id: 'tech-1',
      name: 'Supreet Borikar',
      role: 'Technical Head',
      year: '3rd',
      branch: 'Artificial Intelligence',
      uid: '24001055',
      avatar: '/assets_committee/EI-Photo/Supreet%20Borikar.jpeg',
      photo: '/assets_committee/EI-Photo/Supreet%20Borikar.jpeg',
      isHead: true,
      isCoHead: false,
      tagline: '',
      github: '',
      linkedin: ''
    },
    members: [
      {
        id: 'tech-1',
        name: 'Supreet Borikar',
        role: 'Technical Head',
        year: '3rd',
        branch: 'Artificial Intelligence',
        uid: '24001055',
        avatar: '/assets_committee/EI-Photo/Supreet%20Borikar.jpeg',
        photo: '/assets_committee/EI-Photo/Supreet%20Borikar.jpeg',
        isHead: true,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      },
      {
        id: 'tech-2',
        name: 'Mayuri Atkar',
        role: 'Technical Co-Head',
        year: '3rd',
        branch: 'Information Technology',
        uid: '24010020',
        avatar: '/assets_committee/EI-Photo/mayuri_atkar.jpeg',
        photo: '/assets_committee/EI-Photo/mayuri_atkar.jpeg',
        isHead: false,
        isCoHead: true,
        tagline: 'Growing through every version of me',
        github: 'https://github.com/mayuriatkar5-lgtm',
        linkedin: 'https://www.linkedin.com/in/mayuri-atkar-3913b6343'
      },
      {
        id: 'tech-3',
        name: 'Anushka Mankar',
        role: 'Technical',
        year: '2nd',
        branch: 'Data Science',
        uid: '25006018',
        avatar: '/assets_committee/EI-Photo/Anushka%20Mankar.jpeg',
        photo: '/assets_committee/EI-Photo/Anushka%20Mankar.jpeg',
        isHead: false,
        isCoHead: false,
        tagline: 'Tastes like heaven, burns like hell',
        github: 'https://github.com/anushkamankar49-dotcom',
        linkedin: 'https://www.linkedin.com/in/anushka-mankar-4378153aa/'
      },
      {
        id: 'tech-4',
        name: 'Sharwari Dhandale',
        role: 'Technical',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001034',
        avatar: '/assets_committee/EI-Photo/Sharwari%20dhandale.jpeg',
        photo: '/assets_committee/EI-Photo/Sharwari%20dhandale.jpeg',
        isHead: false,
        isCoHead: false,
        tagline: 'Turning ambition into architecture',
        github: 'https://github.com/Sharwari-2007',
        linkedin: 'https://www.linkedin.com/in/sharwari-dhandale-820a262b8'
      },
      {
        id: 'tech-5',
        name: 'Parth Janai',
        role: 'Technical',
        year: '3rd',
        branch: 'Industrial IoT',
        uid: '25109007',
        avatar: '/assets_committee/EI-Photo/Parth%20Janai.png',
        photo: '/assets_committee/EI-Photo/Parth%20Janai.png',
        isHead: false,
        isCoHead: false,
        tagline: 'Creating today. Inspiring tomorrow',
        github: 'https://github.com/parthjanai24-Master',
        linkedin: 'https://www.linkedin.com/in/parth-janai-85569b334'
      },
      {
        id: 'tech-6',
        name: 'Samruddhi Warudkar',
        role: 'Technical',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001046',
        avatar: '/assets_committee/EI-Photo/SAMRUDDHI%20WARUDKAR_.png',
        photo: '/assets_committee/EI-Photo/SAMRUDDHI%20WARUDKAR_.png',
        isHead: false,
        isCoHead: false,
        tagline: 'Rooted in calm, reaching for more.',
        github: 'https://github.com/samruddhiwarudkar577-prog',
        linkedin: 'https://www.linkedin.com/in/samruddhi-warudkar-58752a393'
      },
      {
        id: 'tech-7',
        name: 'Priyal P. Raut',
        role: 'Technical',
        year: '2nd',
        branch: 'Artificial Intelligence',
        uid: '25001013',
        avatar: '/assets_committee/EI-Photo/Priyal_Raut.jpeg',
        photo: '/assets_committee/EI-Photo/Priyal_Raut.jpeg',
        isHead: false,
        isCoHead: false,
        tagline: 'Curious by Nature, Relentless by Choice',
        github: 'https://github.com/priyalraut703',
        linkedin: 'https://www.linkedin.com/in/priyal-raut-30283937b'
      },
      {
        id: 'tech-8',
        name: 'Samiksha Hedaou',
        role: 'Technical',
        year: '3rd',
        branch: 'Electronics and Telecommunication',
        uid: '24008045',
        avatar: '/assets_committee/EI-Photo/samiksha_hedaou.jpeg',
        photo: '/assets_committee/EI-Photo/samiksha_hedaou.jpeg',
        isHead: false,
        isCoHead: false,
        tagline: 'Curious. Unfiltered. Becoming.',
        github: 'https://github.com/Samiksha-tech-e/On-mobile-vibe-coding-/tree/main',
        linkedin: 'https://www.linkedin.com/in/samiksha-hedaou'
      },
      {
        id: 'tech-9',
        name: 'Sakshi Bute',
        role: 'Technical',
        year: '3rd',
        branch: 'Information Technology',
        uid: '24010002',
        avatar: '',
        photo: '',
        isHead: false,
        isCoHead: false,
        tagline: '',
        github: '',
        linkedin: ''
      }
    ]
  }
];

// Flat list of all 48 members with verified photos
export const OFFICIAL_ALL_MEMBERS = OFFICIAL_COMMITTEE_DOMAINS.flatMap((dom) =>
  dom.members.map((m) => {
    const photoUrl = m.photo || m.avatar || getMemberPhoto(m.name) || '';
    return {
      ...m,
      photo: photoUrl,
      avatar: photoUrl,
      domainId: dom.id,
      domainName: dom.domainName
    };
  })
);

// Unresolved / unassigned records preserved for administrative review
export const UNRESOLVED_EXECUTIVE_PROFILES = [
  {
    id: 'unresolved-yadni-zade',
    name: 'Yadni Zade',
    role: 'Unassigned',
    year: '',
    branch: '',
    uid: '',
    tagline: "Don't chase, Attract!",
    linkedin: 'https://www.linkedin.com/in/yadni-zade-ab68b8382/',
    github: 'https://github.com/Yadni-Zade',
    avatar: '/assets_committee/EI-Photo/yadni%20zade.png',
    photo: '/assets_committee/EI-Photo/yadni%20zade.png',
    status: 'Appears in executive profiles but not in current team roster. Preserved without speculative domain assignment.'
  },
  {
    id: 'unresolved-unnamed-profile',
    name: '[Unidentified Profile]',
    role: 'Unassigned',
    year: '',
    branch: '',
    uid: '',
    tagline: "Everything is falling into place as it's meant to be",
    linkedin: '',
    github: '',
    avatar: '',
    photo: '',
    status: 'Profile supplied with missing name. Preserved as an unresolved record for verification.'
  }
];
