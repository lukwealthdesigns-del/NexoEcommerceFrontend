// import { Users, Package, Globe, Award, Target, Heart } from 'lucide-react';

// const AboutUs = () => {
//   const stats = [
//     { label: 'Products Listed', value: '100K+', icon: Package },
//     { label: 'Happy Sellers', value: '50K+', icon: Users },
//     { label: 'Active Users', value: '500K+', icon: Globe },
//     { label: 'Cities Covered', value: '100+', icon: Target },
//   ];

//   const team = [
//     { name: 'John Doe', title: 'CEO & Founder', bio: 'Former Amazon executive with 15+ years of e-commerce experience', avatar: '👨‍💼' },
//     { name: 'Jane Smith', title: 'CTO', bio: 'Tech leader passionate about building scalable platforms', avatar: '👩‍💻' },
//     { name: 'Mike Johnson', title: 'Head of Operations', bio: 'Logistics expert ensuring smooth deliveries', avatar: '👨‍✈️' },
//     { name: 'Sarah Williams', title: 'Customer Success', bio: 'Dedicated to providing the best user experience', avatar: '👩‍🎓' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-r from-brand-orange to-orange-600 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">About NexoLeolite</h1>
//           <p className="text-xl max-w-3xl mx-auto">
//             Africa's fastest growing marketplace connecting millions of buyers and sellers
//           </p>
//         </div>
//       </section>

//       {/* Mission & Vision */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
//               <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-4">
//                 <Target className="h-8 w-8 text-brand-orange" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h2>
//               <p className="text-gray-600 dark:text-gray-400">
//                 To empower individuals and businesses by providing a trusted, easy-to-use platform 
//                 for buying and selling quality products, fostering economic growth across Africa.
//               </p>
//             </div>
            
//             <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
//               <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-4">
//                 <Heart className="h-8 w-8 text-brand-orange" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Our Vision</h2>
//               <p className="text-gray-600 dark:text-gray-400">
//                 To become the most trusted and innovative e-commerce platform in Africa, 
//                 connecting millions of buyers and sellers seamlessly.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-16 bg-white dark:bg-gray-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
//                   <stat.icon className="h-8 w-8 text-brand-orange" />
//                 </div>
//                 <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
//                 <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Story Section */}
//       <section className="py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
//               <p className="text-gray-600 dark:text-gray-400 mb-4">
//                 Founded in 2020, NexoLeolite started with a simple idea: make it easy for anyone to buy 
//                 and sell quality products online. What began as a small startup in Lagos has grown into 
//                 one of Africa's fastest-growing e-commerce platforms.
//               </p>
//               <p className="text-gray-600 dark:text-gray-400 mb-4">
//                 Today, we serve millions of users across Nigeria and beyond, connecting buyers with 
//                 sellers of everything from electronics to fashion, home goods to automobiles.
//               </p>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Our commitment to innovation, security, and customer satisfaction drives everything we do. 
//                 We're proud to be creating opportunities for entrepreneurs and providing convenience for shoppers.
//               </p>
//             </div>
//             <div className="bg-gradient-to-br from-brand-orange/20 to-brand-light rounded-2xl p-8">
//               <div className="text-center">
//                 <Award className="h-16 w-16 text-brand-orange mx-auto mb-4" />
//                 <p className="text-lg font-semibold text-gray-900 dark:text-white">
//                   "Best E-commerce Platform 2023"
//                 </p>
//                 <p className="text-gray-600 dark:text-gray-400">African Tech Awards</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="py-16 bg-white dark:bg-gray-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">Meet Our Team</h2>
//           <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
//             Passionate individuals dedicated to revolutionizing e-commerce in Africa
//           </p>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {team.map((member, index) => (
//               <div key={index} className="text-center">
//                 <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-brand-orange to-orange-400 p-1 mb-4">
//                   <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-4xl">
//                     {member.avatar}
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
//                 <p className="text-brand-orange text-sm mb-2">{member.title}</p>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">{member.bio}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default AboutUs;

import { Users, Package, Globe, Award, Target, Heart } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { label: 'Products Listed', value: '100K+', icon: Package },
    { label: 'Happy Sellers', value: '50K+', icon: Users },
    { label: 'Active Users', value: '500K+', icon: Globe },
    { label: 'Cities Covered', value: '100+', icon: Target },
  ];

  // Team members – replace image URLs with your own photos
  const team = [
    { 
      name: 'Micheal M', 
      title: 'CTO & Founder', 
      bio: 'AI Logistics expert ensuring smooth deliveries',
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    { 
      name: 'Sanusi Samuel', 
      title: 'Ethical Hacker & Founder', 
      bio: 'Tech leader passionate about building scalable platforms',
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    { 
      name: 'Ibrahim Lukmaam', 
      title: 'Head of Operations& Founder', 
      bio: 'Tech leader passionate about building scalable platforms',
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    { 
      name: 'Ogunleye John', 
      title: 'Customer Success  & Founder', 
      bio: 'Dedicated to providing the best user experience',
      image: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    { 
      name: 'Olabode Olamide', 
      title: 'AI Fullstack Developer & Founder', 
      bio: 'Tech leader passionate about building Ai web platforms',
      image: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    { 
      name: 'Oyedoyin Samuel', 
      title: 'Backend Developer  & Founder', 
      bio: 'Dedicated to providing the best user experience',
      image: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section – with e‑commerce background image */}
      <section className="relative overflow-hidden">
        {/* Background image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop" 
            alt="E-commerce shopping"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About NexoLeolite</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Africa's fastest growing marketplace connecting millions of buyers and sellers
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-brand-orange" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400">
                To empower individuals and businesses by providing a trusted, easy-to-use platform 
                for buying and selling quality products, fostering economic growth across Africa.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-brand-orange" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-400">
                To become the most trusted and innovative e-commerce platform in Africa, 
                connecting millions of buyers and sellers seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-8 w-8 text-brand-orange" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section – with e‑commerce background image */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&h=800&fit=crop" 
            alt="Online shopping background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Founded in 2026, NexoLeolite started with a simple idea: make it easy for anyone to buy 
                and sell quality products online. What began as a small startup in Abeokuta has grown into 
                one of Africa's fastest-growing e-commerce platforms.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Today, we serve millions of users across Nigeria and beyond, connecting buyers with 
                sellers of everything from electronics to fashion, home goods to automobiles.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Our commitment to innovation, security, and customer satisfaction drives everything we do. 
                We're proud to be creating opportunities for entrepreneurs and providing convenience for shoppers.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <Award className="h-16 w-16 text-brand-orange mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  "Best E-commerce Platform 2026"
                </p>
                <p className="text-gray-600 dark:text-gray-400">African Tech Awards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section – with real images */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">Meet Our Team</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Passionate individuals dedicated to revolutionizing e-commerce in Africa
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 shadow-lg">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-brand-orange text-sm mb-2">{member.title}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;