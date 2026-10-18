


// import { Users, Package, Globe, Award, Target, Heart, Sparkles, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

// const AboutUs = () => {
//   const stats = [
//     { label: 'Products Listed', value: '100K+', icon: Package },
//     { label: 'Happy Sellers', value: '50K+', icon: Users },
//     { label: 'Active Users', value: '500K+', icon: Globe },
//     { label: 'Cities Covered', value: '100+', icon: Target },
//   ];

//   const values = [
//     {
//       icon: ShieldCheck,
//       title: 'Trust & Security',
//       description:
//         'Every transaction is protected with bank-grade encryption and verified sellers.',
//     },
//     {
//       icon: Zap,
//       title: 'Speed & Innovation',
//       description:
//         'From AI-powered logistics to instant checkout — we obsess over every millisecond.',
//     },
//     {
//       icon: Heart,
//       title: 'Customer First',
//       description:
//         'Real humans, real support. We win when our buyers and sellers win.',
//     },
//     {
//       icon: TrendingUp,
//       title: 'Growth for All',
//       description:
//         'We help small businesses scale into brands that reach millions.',
//     },
//   ];

//   const team = [
//     {
//       name: 'Olabode Olamide',
//       title: 'CEO & Co-Founder',
//       bio: 'AI Fullstack Engineer leading NexoLeolite\u2019s vision of an AI-first commerce platform for Africa.',
//       image: '/olamide.png',
//       accent: 'from-orange-500 to-amber-400',
//     },
//     {
//       name: 'Ibrahim Lukman',
//       title: 'CEO & Co-Founder',
//       bio: 'Operations strategist building the logistics backbone that powers millions of deliveries.',
//       image: '/bro.png',
//       accent: 'from-indigo-500 to-purple-500',
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Hero */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <img
//             src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop"
//             alt="E-commerce shopping"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-brand-orange/40"></div>
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
//           <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-medium mb-6">
//             <Sparkles className="h-4 w-4 text-brand-orange" />
//             Trusted by millions across Africa
//           </span>
//           <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
//             About <span className="text-brand-orange">NexoLeolite</span>
//           </h1>
//           <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
//             Africa's fastest-growing marketplace — connecting millions of buyers and sellers
//             through trust, technology, and relentless innovation.
//           </p>
//         </div>
//       </section>

//       {/* Mission & Vision */}
//       <section className="py-16 md:py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
//             <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
//               <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                 <Target className="h-8 w-8 text-brand-orange" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
//                 Our Mission
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
//                 To empower individuals and businesses by providing a trusted, easy-to-use
//                 platform for buying and selling quality products — fostering economic
//                 growth across Africa.
//               </p>
//             </div>

//             <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
//               <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                 <Heart className="h-8 w-8 text-brand-orange" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
//                 Our Vision
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
//                 To become the most trusted and innovative e-commerce platform in Africa —
//                 connecting millions of buyers and sellers seamlessly, and setting the
//                 standard for what commerce should feel like.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats */}
//       <section className="py-16 bg-white dark:bg-gray-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {stats.map((stat, index) => (
//               <div
//                 key={index}
//                 className="text-center p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
//               >
//                 <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <stat.icon className="h-8 w-8 text-brand-orange" />
//                 </div>
//                 <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
//                   {stat.value}
//                 </p>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                   {stat.label}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Story */}
//       <section className="relative overflow-hidden py-16 md:py-20">
//         <div className="absolute inset-0 z-0">
//           <img
//             src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&h=800&fit=crop"
//             alt="Online shopping background"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-white/85 dark:bg-gray-900/85"></div>
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
//                 Our Story
//               </span>
//               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-6">
//                 Built in Nigeria. Built for Africa.
//               </h2>
//               <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
//                 Founded in 2026, NexoLeolite started with a simple idea: make it easy for
//                 anyone to buy and sell quality products online. What began as a small
//                 startup in Abeokuta has grown into one of Africa's fastest-growing
//                 e-commerce platforms.
//               </p>
//               <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
//                 Today, we serve millions of users across Nigeria and beyond — connecting
//                 buyers with sellers of everything from electronics to fashion, home goods
//                 to automobiles.
//               </p>
//               <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
//                 Our commitment to innovation, security, and customer satisfaction drives
//                 everything we do. We're proud to create opportunities for entrepreneurs
//                 and deliver convenience for shoppers.
//               </p>
//             </div>

//             <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-white/40 dark:border-gray-700/60">
//               <div className="text-center">
//                 <Award className="h-16 w-16 text-brand-orange mx-auto mb-6" />
//                 <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                   "Best E-commerce Platform 2026"
//                 </p>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   African Tech Awards
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Values */}
//       <section className="py-16 md:py-20 bg-white dark:bg-gray-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
//               What Drives Us
//             </span>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
//               Our Core Values
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//               The principles behind every decision, every feature, and every delivery.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {values.map((value, index) => (
//               <div
//                 key={index}
//                 className="group p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-brand-orange/5 dark:hover:bg-brand-orange/10 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1"
//               >
//                 <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-orange transition-colors">
//                   <value.icon className="h-6 w-6 text-brand-orange group-hover:text-white transition-colors" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                   {value.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
//                   {value.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Leadership — Cards, not circles */}
//       <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-14">
//             <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
//               Leadership
//             </span>
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
//               Meet the Founders
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//               Two builders, one vision: to redefine commerce for the next generation
//               of Africans.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
//             {team.map((member, index) => (
//               <div
//                 key={index}
//                 className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
//               >
//                 {/* Image area */}
//                 <div className="relative h-96 overflow-hidden bg-gray-100 dark:bg-gray-900">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
//                   />
//                   {/* Colored gradient on hover */}
//                   <div
//                     className={`absolute inset-0 bg-gradient-to-t ${member.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
//                   ></div>
//                   {/* Dark gradient for text legibility */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

//                   {/* Name over image */}
//                   <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                     <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
//                     <p className="text-sm font-medium text-white/90">
//                       {member.title}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Bio area */}
//                 <div className="p-6 md:p-8">
//                   <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
//                     {member.bio}
//                   </p>

//                   <div className="mt-6 flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
//                     <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
//                       <Sparkles className="h-5 w-5 text-brand-orange" />
//                     </div>
//                     <div>
//                       <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
//                         Co-Founder & CEO
//                       </p>
//                       <p className="text-sm font-semibold text-gray-900 dark:text-white">
//                         NexoLeolite
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-16 md:py-20 bg-gray-900 dark:bg-black">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//             Join the movement
//           </h2>
//           <p className="text-gray-400 mb-8 max-w-xl mx-auto">
//             Whether you're buying, selling, or building — NexoLeolite is your home for
//             commerce in Africa.
//           </p>
//           <a
//             href="/shop"
//             className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold transition-colors"
//           >
//             Explore the Marketplace
//           </a>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AboutUs;

import React from 'react';
import {
  Users,
  Package,
  Globe,
  Target,
  Heart,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  MessageCircle,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Store,
  Eye,
  FileText,
  Ban,
  LockKeyhole,
  Scale,
  Flag,
} from 'lucide-react';

const AboutUs = () => {
  const features = [
    {
      label: 'Discover Products',
      description: 'Explore products and services listed by vendors on Nexoleolite.',
      icon: Package,
    },
    {
      label: 'Connect Directly',
      description: 'Chat with buyers and sellers to ask questions and discuss products.',
      icon: MessageCircle,
    },
    {
      label: 'Promote Your Business',
      description: 'Promote eligible listings to help more potential customers discover them.',
      icon: TrendingUp,
    },
    {
      label: 'Shop More Carefully',
      description: 'Review listings, ask questions, and follow our safety guidance before buying.',
      icon: ShieldCheck,
    },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: 'Safety Awareness',
      description: 'We encourage responsible buying, honest selling, and careful verification before transactions.',
    },
    {
      icon: Zap,
      title: 'Convenience',
      description: 'Discover products, contact sellers, and explore marketplace opportunities in one place.',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We aim to create a useful marketplace where buyers and sellers can communicate respectfully.',
    },
    {
      icon: TrendingUp,
      title: 'Growth for All',
      description: 'We help vendors showcase products and connect with potential customers.',
    },
  ];

  const team = [
    {
      name: 'Olabode Olamide',
      title: 'CEO & Co-Founder',
      bio: 'AI and full-stack software developer helping build Nexoleolite’s vision of a connected marketplace for buyers and sellers.',
      image: '/olamide.png',
      accent: 'from-orange-500 to-amber-400',
    },
    {
      name: 'Ibrahim Lukman',
      title: 'Co-Founder',
      bio: 'Focused on operations and helping develop the business processes behind Nexoleolite’s marketplace vision.',
      image: '/bro.png',
      accent: 'from-indigo-500 to-purple-500',
    },
  ];

  const termsSections = [
    {
      number: '01',
      title: 'Acceptance of Terms',
      icon: FileText,
      paragraphs: [
        'By creating an account, browsing listings, posting products, promoting listings, or communicating with other users on Nexoleolite, you agree to these Terms and Conditions and the applicable Privacy Policy.',
        'If you do not agree with these terms, you must stop using the platform. Where applicable law requires additional consent, that consent must be obtained separately.',
      ],
    },
    {
      number: '02',
      title: 'What Nexoleolite Offers',
      icon: Globe,
      paragraphs: [
        'Nexoleolite is a marketplace designed to connect buyers, sellers, vendors, and people searching for products or properties.',
        'Depending on the features available, users can list products, discover listings, promote eligible products, communicate directly through chat, ask questions about availability and prices, and explore property listings.',
        'Unless a particular service expressly says otherwise, a listing or conversation does not mean Nexoleolite has independently verified the product, seller, property, ownership, or transaction.',
      ],
    },
    {
      number: '03',
      title: 'Accounts and User Responsibilities',
      icon: Users,
      paragraphs: [
        'You must provide accurate account information, protect your login credentials, and promptly report suspected unauthorized access.',
        'You must not impersonate another person, use another person’s account without authorization, create accounts for fraudulent purposes, or use Nexoleolite to deceive other users.',
        'You are responsible for your communications, listings, and conduct on the platform, subject to applicable law.',
      ],
    },
    {
      number: '04',
      title: 'Product Listings and Promotions',
      icon: Store,
      paragraphs: [
        'Sellers must provide truthful product descriptions, prices, photographs, condition details, and availability information. Sellers must have the legal right and authority to offer their products.',
        'Listings must not contain fraudulent claims, misleading prices, counterfeit goods, stolen items, or goods and services prohibited by applicable law or Nexoleolite policies.',
        'Paid promotion can increase a listing’s visibility, but it does not guarantee sales, enquiries, engagement, or revenue. Any applicable price and duration should be displayed before purchase.',
        'Nexoleolite may remove or restrict listings and promotions that violate these terms or applicable law.',
      ],
    },
    {
      number: '05',
      title: 'Direct Chat and Communication',
      icon: MessageCircle,
      paragraphs: [
        'Nexoleolite enables users to communicate directly where messaging features are available. Buyers and sellers may discuss product details, prices, availability, and suitable arrangements.',
        'Users must communicate respectfully. Harassment, threats, impersonation, spam, fraudulent offers, and attempts to obtain another person’s passwords, PINs, or one-time passwords are prohibited.',
        'Do not assume that a person is trustworthy simply because you recognize their name, have spoken to them before, see a familiar profile, or believe they are a friend or relative.',
        'Keep relevant conversations and transaction evidence where possible. Report suspicious accounts and payment requests through Nexoleolite’s official support channel.',
      ],
    },
    {
      number: '06',
      title: 'Payment Safety and Anti-Scam Policy',
      icon: CreditCard,
      paragraphs: [
        'For a transaction represented as being processed, authorized, or protected by Nexoleolite, you must use only the official Nexoleolite checkout or payment channel that Nexoleolite has expressly authorized and made available for that transaction.',
        'Never send money to another user’s personal bank account or wallet for a transaction represented as an official Nexoleolite transaction. This rule applies even if the person is a friend, relative, familiar vendor, repeat seller, or someone claiming to work for Nexoleolite.',
        'Never rely only on account details, payment screenshots, receipts, forwarded messages, or payment instructions supplied privately by another user. Verify payment instructions through the genuine Nexoleolite website or an independently verified official support channel.',
        'Do not pay under pressure to secure a product, property, discount, delivery, or special offer. Do not share your bank PIN, card PIN, password, OTP, or other authentication credentials with another user or anyone claiming to represent Nexoleolite.',
        'If an official payment method is not available for a transaction, do not assume Nexoleolite has authorized, received, secured, or guaranteed the payment. Contact official support for clarification before proceeding.',
        'A user cannot make a personal bank account an official Nexoleolite payment account simply by claiming that it belongs to Nexoleolite. Verify the destination before authorizing any payment.',
        'If you suspect fraud or have transferred money to a suspicious account, preserve your evidence, contact your bank or payment provider immediately, and report the incident to Nexoleolite.',
      ],
    },
    {
      number: '07',
      title: 'Buyer Responsibilities',
      icon: Eye,
      paragraphs: [
        'Read listings carefully and ask questions about price, condition, authenticity, availability, and delivery before making a decision.',
        'Take reasonable steps to verify the seller and inspect goods before accepting them where possible.',
        'For properties, independently check relevant ownership or agency authority, property details, documentation, and availability before making commitments.',
        'Follow the payment safety policy and do not assume that a profile, review, photograph, badge, or private message guarantees a safe transaction.',
      ],
    },
    {
      number: '08',
      title: 'Seller Responsibilities',
      icon: Package,
      paragraphs: [
        'Sellers must describe products honestly, disclose relevant defects and conditions, provide accurate prices, and communicate clearly about availability and delivery.',
        'Sellers must not misrepresent personal payment details as official Nexoleolite payment details or falsely claim that Nexoleolite has guaranteed a transaction.',
        'Sellers are responsible for meeting their commitments and complying with applicable laws. These terms do not remove any consumer rights that cannot legally be excluded.',
      ],
    },
    {
      number: '09',
      title: 'Property Listings',
      icon: Target,
      paragraphs: [
        'Property listings must contain truthful information about location, price, availability, features, and relevant conditions.',
        'Users must not advertise property without the required authority or misrepresent their ownership, agency status, or right to let or sell a property.',
        'Prospective buyers and tenants should verify relevant documentation and authority, inspect the property where possible, and obtain appropriate advice before signing agreements or transferring money.',
        'A property listing on Nexoleolite is not, by itself, proof of ownership, legitimacy, or availability.',
      ],
    },
    {
      number: '10',
      title: 'Fraud and Prohibited Activities',
      icon: Ban,
      paragraphs: [
        'Fraud, scams, impersonation, fake listings, phishing, malicious links, counterfeit goods, harassment, threats, and unauthorized use of personal information are prohibited.',
        'Users must not ask others to make unauthorized payments while falsely claiming that Nexoleolite has approved or guaranteed the transaction.',
        'Nexoleolite may investigate reports, restrict or remove content, limit messaging, suspend accounts, and refer suspected unlawful conduct to the appropriate authorities where appropriate and lawful.',
      ],
    },
    {
      number: '11',
      title: 'Privacy and Personal Information',
      icon: LockKeyhole,
      paragraphs: [
        'Users must respect other people’s privacy and must not misuse personal information obtained through the platform.',
        'Do not publish another person’s private information without proper authorization. Do not disclose passwords, banking credentials, PINs, or OTPs in chat.',
        'Personal information handled by Nexoleolite is subject to its applicable Privacy Policy and data protection obligations.',
      ],
    },
    {
      number: '12',
      title: 'Platform Role and Transaction Disputes',
      icon: Scale,
      paragraphs: [
        'Unless a specific service expressly states otherwise, Nexoleolite provides marketplace and communication features and is not automatically the seller, property owner, delivery provider, payment recipient, or guarantor for transactions between users.',
        'Direct chat does not mean Nexoleolite has verified a listing, received money, guaranteed delivery, or agreed to refund a purchase.',
        'Where Nexoleolite expressly provides an authorized payment, checkout, delivery, or buyer-protection service, the specific terms for that service also apply.',
        'Users should report disputes and suspected fraud through official support. Nexoleolite will handle reports within the scope of its services and applicable law. Nothing in these terms excludes liability or legal obligations that cannot lawfully be excluded.',
      ],
    },
    {
      number: '13',
      title: 'Account Suspension and Listing Removal',
      icon: ShieldCheck,
      paragraphs: [
        'Nexoleolite may remove listings, restrict features, suspend accounts, or terminate access where there are reasonable grounds to believe that a user has violated these terms, engaged in fraud, endangered other users, or breached applicable law.',
        'Where appropriate and lawful, Nexoleolite may request information, review reports, and take steps to protect users and the integrity of the platform.',
      ],
    },
    {
      number: '14',
      title: 'Changes to These Terms',
      icon: FileText,
      paragraphs: [
        'Nexoleolite may update these terms when services, safety measures, payment procedures, or legal requirements change.',
        'Updated terms will be published on the website with a revised effective date. Where required by law, users will be notified of material changes or asked to provide renewed consent.',
      ],
    },
    {
      number: '15',
      title: 'Applicable Law',
      icon: Scale,
      paragraphs: [
        'These terms are intended to operate in accordance with the laws of the Federal Republic of Nigeria and any other applicable mandatory laws.',
        'Disputes will be handled through an appropriate lawful dispute-resolution process, subject to applicable consumer rights and legal requirements.',
      ],
    },
    {
      number: '16',
      title: 'Contact and Reporting',
      icon: Flag,
      paragraphs: [
        'To report suspicious listings, fraudulent messages, unauthorized payment requests, or other concerns, use the official support contact details published on the genuine Nexoleolite website.',
        'Always verify that you are using https://www.nexoleolite.com before providing sensitive information or following payment instructions.',
      ],
    },
  ];

  const privacySections = [
    {
      title: '1. Information We May Collect',
      paragraphs: [
        'Depending on the features you use, Nexoleolite may collect account information such as your name, username, email address, phone number, profile photograph, and other details you choose to provide.',
        'We may also process information about product or property listings, messages, account preferences, transactions handled through supported services, and communications with customer support.',
        'Technical information such as device, browser, log, and usage information may be processed where necessary to operate, maintain, and protect the platform.',
      ],
    },
    {
      title: '2. How We Use Information',
      paragraphs: [
        'We may use information to create and manage accounts, display profiles and listings, enable messaging, provide marketplace features, process supported transactions, respond to enquiries, and deliver requested services.',
        'Information may also be used to prevent fraud, investigate suspicious activity, enforce our Terms and Conditions, maintain platform security, improve services, and meet applicable legal obligations.',
        'We will not describe a service as providing a particular protection or guarantee unless that service is actually offered under its applicable terms.',
      ],
    },
    {
      title: '3. Messages and Public Listings',
      paragraphs: [
        'Information included in public profiles and listings may be visible to other users and visitors. Consider carefully what you publish.',
        'Messages sent through marketplace communication features may be processed to deliver messages, maintain the service, investigate reports, and address safety or legal concerns where appropriate.',
        'Do not send passwords, bank PINs, card security details, or one-time passwords to other users through chat.',
      ],
    },
    {
      title: '4. Cookies and Technical Information',
      paragraphs: [
        'Nexoleolite may use cookies, local storage, or similar technologies where implemented to support essential functionality, remember preferences, maintain sessions, and understand service performance.',
        'The specific technologies used depend on the website configuration and features enabled. You can review your browser settings to manage certain cookies or stored data, although disabling essential technologies may affect functionality.',
      ],
    },
    {
      title: '5. When Information May Be Shared',
      paragraphs: [
        'Information may be shared with other users when you choose to publish a listing, create a public profile, or communicate with them.',
        'Where necessary to provide a requested service, information may be processed by service providers such as hosting, database, communications, analytics, or payment providers, depending on which services Nexoleolite uses.',
        'Information may also be disclosed when required by applicable law, lawful legal process, or when reasonably necessary to investigate fraud, protect users, or safeguard platform rights and security.',
        'We do not promise that information is never shared. Any sharing must be assessed in light of the service provided, applicable law, and relevant privacy obligations.',
      ],
    },
    {
      title: '6. Payments and Financial Information',
      paragraphs: [
        'When an official payment service is available, the payment information required for that service may be processed by Nexoleolite and/or the relevant payment provider, according to the service arrangement.',
        'Do not send money to another user’s personal bank account for a transaction represented as an official Nexoleolite transaction. Use only payment channels Nexoleolite expressly authorizes for that transaction.',
        'Never share your banking PIN, password, card security credentials, or one-time passwords with another user. Contact your bank or payment provider promptly if you suspect financial fraud.',
      ],
    },
    {
      title: '7. Data Retention',
      paragraphs: [
        'Information may be retained for as long as reasonably necessary for the purposes described in this policy, including account operation, service delivery, dispute handling, security, record keeping, and legal compliance.',
        'Actual retention periods may vary depending on the type of information, the service involved, and applicable legal requirements. Information may be deleted, anonymized, or retained where lawful and appropriate.',
      ],
    },
    {
      title: '8. Security',
      paragraphs: [
        'We aim to use appropriate measures to protect information handled through Nexoleolite. However, no online service or method of electronic storage can be guaranteed to be completely secure.',
        'Protect your password, sign out of shared devices, use secure devices and connections, and report suspected unauthorized access. Do not share account verification codes with anyone.',
      ],
    },
    {
      title: '9. Your Privacy Rights',
      paragraphs: [
        'Depending on applicable law, you may have rights to request access to, correction of, deletion of, or other action concerning your personal information. You may also have rights relating to consent or objections to certain processing.',
        'Requests may be subject to identity verification, legal exceptions, and obligations to retain certain records. Contact Nexoleolite through the official support details published on our genuine website to make a privacy request.',
      ],
    },
    {
      title: '10. Children’s Privacy',
      paragraphs: [
        'Users must meet the minimum age and eligibility requirements applicable to the services they use. Where applicable law requires parental consent or additional safeguards, those requirements must be followed.',
        'If you believe a child has provided personal information inappropriately, contact us through our official support channel so the concern can be reviewed.',
      ],
    },
    {
      title: '11. Third-Party Services and Links',
      paragraphs: [
        'Nexoleolite may link to or integrate with third-party websites or services. Those providers may have their own privacy policies and practices.',
        'We encourage you to review the relevant third-party privacy information before providing personal data or making a payment. Nexoleolite cannot promise that an independent third party follows this policy.',
      ],
    },
    {
      title: '12. Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy when our services, data practices, or legal obligations change. The latest version will be published on this page with an updated effective date.',
        'Where applicable law requires notice or additional consent for a material change, we will take the steps required by law.',
      ],
    },
    {
      title: '13. Contact Us',
      paragraphs: [
        'For privacy questions or requests, contact Nexoleolite using the official contact details on our Contact page at https://www.nexoleolite.com/contact.',
        'Please avoid including passwords, bank PINs, one-time passwords, or unnecessary sensitive information in your enquiry.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop"
            alt="Online shopping and marketplace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/65 to-orange-600/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 text-brand-orange" />
            Discover. Connect. Trade responsibly.
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            About <span className="text-brand-orange">Nexoleolite</span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            A marketplace built to help buyers discover products, vendors promote
            their businesses, and people connect directly through chat.
          </p>

          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 mt-8 px-7 py-3 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold transition-colors"
          >
            Discover Nexoleolite
          </a>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-brand-orange" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To make it easier for people to discover products, for vendors to
                reach potential customers, and for buyers and sellers to communicate
                directly in one accessible marketplace.
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8 text-brand-orange" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Our Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To build a useful and trusted marketplace where businesses can grow,
                buyers can find what they need, and users can connect with greater
                convenience and awareness of online safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Nexoleolite Works */}
      <section id="how-it-works" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              Explore the Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              How Nexoleolite Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find products, connect with sellers, and create opportunities for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-5">
                  <feature.icon className="h-7 w-7 text-brand-orange" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&h=800&fit=crop"
            alt="Online commerce"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-6">
                Built in Nigeria. Connecting people through commerce.
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Nexoleolite was created around a simple idea: make it easier for people
                to discover products and for vendors to connect with potential buyers.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Through product listings, promotional features, and direct communication,
                Nexoleolite aims to help buyers find what they need and help sellers
                showcase what they offer.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We believe that convenience should go hand in hand with responsibility.
                That is why users are encouraged to verify information, communicate
                honestly, and follow the platform’s payment safety rules.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl border border-white/40 dark:border-gray-700/60">
              <ShieldCheck className="h-16 w-16 text-brand-orange mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                Your Safety Matters
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Ask questions, check listings, and verify payment instructions.
                Never assume a transaction is protected just because someone is
                familiar or claims to represent Nexoleolite.
              </p>
              <a
                href="#payment-safety"
                className="inline-flex items-center justify-center w-full mt-6 px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold transition-colors"
              >
                Read Payment Safety Rules
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              What Drives Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide the marketplace we are building.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="group p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-brand-orange/5 dark:hover:bg-brand-orange/10 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-orange transition-colors">
                  <value.icon className="h-6 w-6 text-brand-orange group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Safety Warning */}
      <section
        id="payment-safety"
        className="scroll-mt-24 py-16 md:py-20 bg-orange-50 dark:bg-gray-950"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border-2 border-red-300 dark:border-red-900 bg-white dark:bg-gray-900 shadow-lg">
            <div className="bg-red-600 px-6 py-5 md:px-8">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-white shrink-0" />
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                  IMPORTANT: PAYMENT SAFETY WARNING
                </h2>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-lg md:text-xl font-extrabold text-red-700 dark:text-red-400 mb-5">
                NEVER SEND MONEY TO ANOTHER USER’S PERSONAL BANK ACCOUNT FOR A
                TRANSACTION REPRESENTED AS AN OFFICIAL NEXOLEOLITE TRANSACTION.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                This rule applies even if the person is your friend, family member,
                relative, familiar vendor, repeat seller, or someone who claims to
                work for Nexoleolite. Familiarity is not proof that a payment request
                is genuine.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Use only verified official payment channels
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Use an authorized Nexoleolite checkout or payment method
                      explicitly provided for the transaction. Verify payment
                      instructions through the genuine website or official support.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ban className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Do not pay personal accounts for supposed Nexoleolite transactions
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Do not accept private account details, forwarded messages,
                      screenshots, or verbal assurances as proof that a payment
                      destination is authorized.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <LockKeyhole className="h-6 w-6 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Never share your PIN, password, or OTP
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Never disclose banking credentials or authentication codes
                      to another user.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Flag className="h-6 w-6 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Report suspicious requests immediately
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Preserve relevant chats and payment instructions. If you suspect
                      fraud after transferring money, contact your bank or payment
                      provider immediately and report the incident to Nexoleolite.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 p-5">
                <p className="font-bold text-gray-900 dark:text-white mb-2">
                  What if there is no official payment option?
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Do not assume Nexoleolite has received, secured, approved, or
                  guaranteed the payment. Contact official support for clarification
                  before proceeding. Direct chat alone does not mean Nexoleolite
                  holds your money or guarantees delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section
        id="privacy-policy"
        className="scroll-mt-24 py-16 md:py-24 bg-white dark:bg-gray-800"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-5">
              <LockKeyhole className="h-8 w-8 text-brand-orange" />
            </div>
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              Your Information Matters
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mt-3 mb-5">
              Privacy Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              This policy explains how Nexoleolite may collect, use, share, and
              protect information when you use our marketplace, account, messaging,
              listing, and related services.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Effective date: 18 October 2026
            </p>
          </div>

          <div className="space-y-5">
            {privacySections.map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 md:p-8"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-600 dark:text-gray-300 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-orange shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  Protect Your Personal Information
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Verify that you are using the genuine Nexoleolite website.
                  Do not share your account credentials, banking PIN, or OTP
                  with another user or anyone claiming to represent Nexoleolite.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms and Conditions */}
      <section
        id="terms-and-conditions"
        className="scroll-mt-24 py-16 md:py-24 bg-gray-50 dark:bg-gray-900"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-5">
              <FileText className="h-8 w-8 text-brand-orange" />
            </div>
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              Please Read Carefully
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mt-3 mb-5">
              Terms and Conditions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              These terms explain the rules for using Nexoleolite, communicating
              with other users, publishing listings, promoting products, and following
              our payment safety requirements.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Effective date: 18 October 2026
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 md:p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              A note about payments and protection
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Nexoleolite’s marketplace and chat features do not, by themselves,
              mean that a transaction is guaranteed, a payment is held by Nexoleolite,
              or a refund is assured. Any payment-processing or buyer-protection
              service applies only where Nexoleolite expressly offers that service
              under its specific terms.
            </p>
          </div>

          <div className="space-y-5">
            {termsSections.map((section) => (
              <article
                key={section.number}
                id={section.number === '06' ? 'terms-payment-policy' : undefined}
                className="scroll-mt-24 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0">
                    <section.icon className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-1">
                      Section {section.number}
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {section.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-600 dark:text-gray-300 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-gray-900 dark:bg-black p-6 md:p-8 text-center">
            <ShieldCheck className="h-10 w-10 text-brand-orange mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
              Chat directly. Trade responsibly.
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Discover products, ask questions, promote your business, and connect
              with other users. Always verify listings and official payment instructions
              before committing your money.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Meet the Founders
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Building a marketplace focused on connection, accessibility, and opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="group relative overflow-hidden rounded-3xl bg-gray-50 dark:bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
              >
                <div className="relative h-96 overflow-hidden bg-gray-100 dark:bg-gray-950">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${member.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-sm font-medium text-white/90">
                      {member.title}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="mt-6 flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Nexoleolite Leadership
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Nexoleolite
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-gray-900 dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the Nexoleolite Community
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Discover products, promote your business, and connect directly with
            buyers and sellers while following safe marketplace practices.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold transition-colors"
          >
            <Package className="h-5 w-5" />
            Explore the Marketplace
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Nexoleolite. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm">
            <a
              href="#terms-and-conditions"
              className="inline-flex items-center gap-2 text-white hover:text-brand-orange transition-colors"
            >
              <FileText className="h-4 w-4" />
              Terms and Conditions
            </a>

            <a
              href="#privacy-policy"
              className="inline-flex items-center gap-2 text-white hover:text-brand-orange transition-colors"
            >
              <LockKeyhole className="h-4 w-4" />
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
