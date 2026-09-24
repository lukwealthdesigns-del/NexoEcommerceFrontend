

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
//       image: 'https://randomuser.me/api/portraits/men/4.jpg',
//       accent: 'from-orange-500 to-amber-400',
//     },
//     {
//       name: 'Ibrahim Lukman',
//       title: 'CEO & Co-Founder',
//       bio: 'Operations strategist building the logistics backbone that powers millions of deliveries.',
//       image: 'https://randomuser.me/api/portraits/men/3.jpg',
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
//                 <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
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
//                 <div className="relative h-80 overflow-hidden">
//                   <img
//                     src={member.image}
//                     alt={member.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
//                   />
//                   {/* Gradient overlay */}
//                   <div className={`absolute inset-0 bg-gradient-to-t ${member.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

//                   {/* Name over image */}
//                   <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                     <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
//                     <p className="text-sm font-medium text-white/90">{member.title}</p>
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


import { Users, Package, Globe, Award, Target, Heart, Sparkles, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { label: 'Products Listed', value: '100K+', icon: Package },
    { label: 'Happy Sellers', value: '50K+', icon: Users },
    { label: 'Active Users', value: '500K+', icon: Globe },
    { label: 'Cities Covered', value: '100+', icon: Target },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: 'Trust & Security',
      description:
        'Every transaction is protected with bank-grade encryption and verified sellers.',
    },
    {
      icon: Zap,
      title: 'Speed & Innovation',
      description:
        'From AI-powered logistics to instant checkout — we obsess over every millisecond.',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description:
        'Real humans, real support. We win when our buyers and sellers win.',
    },
    {
      icon: TrendingUp,
      title: 'Growth for All',
      description:
        'We help small businesses scale into brands that reach millions.',
    },
  ];

  const team = [
    {
      name: 'Olabode Olamide',
      title: 'CEO & Co-Founder',
      bio: 'AI Fullstack Engineer leading NexoLeolite\u2019s vision of an AI-first commerce platform for Africa.',
      image: '/olamide.png',
      accent: 'from-orange-500 to-amber-400',
    },
    {
      name: 'Ibrahim Lukman',
      title: 'CEO & Co-Founder',
      bio: 'Operations strategist building the logistics backbone that powers millions of deliveries.',
      image: '/bro.png',
      accent: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop"
            alt="E-commerce shopping"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-brand-orange/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 text-brand-orange" />
            Trusted by millions across Africa
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            About <span className="text-brand-orange">NexoLeolite</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Africa's fastest-growing marketplace — connecting millions of buyers and sellers
            through trust, technology, and relentless innovation.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
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
                To empower individuals and businesses by providing a trusted, easy-to-use
                platform for buying and selling quality products — fostering economic
                growth across Africa.
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
                To become the most trusted and innovative e-commerce platform in Africa —
                connecting millions of buyers and sellers seamlessly, and setting the
                standard for what commerce should feel like.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-brand-orange" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
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
            alt="Online shopping background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/85 dark:bg-gray-900/85"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-6">
                Built in Nigeria. Built for Africa.
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Founded in 2026, NexoLeolite started with a simple idea: make it easy for
                anyone to buy and sell quality products online. What began as a small
                startup in Abeokuta has grown into one of Africa's fastest-growing
                e-commerce platforms.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Today, we serve millions of users across Nigeria and beyond — connecting
                buyers with sellers of everything from electronics to fashion, home goods
                to automobiles.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our commitment to innovation, security, and customer satisfaction drives
                everything we do. We're proud to create opportunities for entrepreneurs
                and deliver convenience for shoppers.
              </p>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-white/40 dark:border-gray-700/60">
              <div className="text-center">
                <Award className="h-16 w-16 text-brand-orange mx-auto mb-6" />
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  "Best E-commerce Platform 2026"
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  African Tech Awards
                </p>
              </div>
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
              The principles behind every decision, every feature, and every delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
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

      {/* Leadership — Cards, not circles */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-wider">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Meet the Founders
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Two builders, one vision: to redefine commerce for the next generation
              of Africans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
              >
                {/* Image area */}
                <div className="relative h-96 overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Colored gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${member.accent} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                  ></div>
                  {/* Dark gradient for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Name over image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-sm font-medium text-white/90">
                      {member.title}
                    </p>
                  </div>
                </div>

                {/* Bio area */}
                <div className="p-6 md:p-8">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="mt-6 flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Co-Founder & CEO
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        NexoLeolite
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gray-900 dark:bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the movement
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Whether you're buying, selling, or building — NexoLeolite is your home for
            commerce in Africa.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold transition-colors"
          >
            Explore the Marketplace
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;