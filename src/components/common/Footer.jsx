

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => {
  // 30 beautiful product images (fully visible on all devices)
  const slides = [
    { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1920&h=1080&fit=crop', alt: 'Smartphone' },
    { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1920&h=1080&fit=crop', alt: 'Laptop' },
    { url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1920&h=1080&fit=crop', alt: 'Television' },
    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&h=1080&fit=crop', alt: 'Sneakers' },
    { url: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=1920&h=1080&fit=crop', alt: 'Designer chairs' },
    { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1920&h=1080&fit=crop', alt: 'Handbag' },
    { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&h=1080&fit=crop', alt: 'Watch' },
    { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&h=1080&fit=crop', alt: 'Headphones' },
    { url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1920&h=1080&fit=crop', alt: 'Perfume' },
    { url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1920&h=1080&fit=crop', alt: 'Smartwatch' },
    { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1920&h=1080&fit=crop', alt: 'Dress' },
    { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1920&h=1080&fit=crop', alt: 'T-shirt' },
    { url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1920&h=1080&fit=crop', alt: 'Shoes' },
    { url: 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=1920&h=1080&fit=crop', alt: 'Handbag collection' },
    { url: 'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?w=1920&h=1080&fit=crop', alt: 'Camera' },
    { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop', alt: 'Sunglasses' },
    { url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=1920&h=1080&fit=crop', alt: 'Makeup' },
    { url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=1920&h=1080&fit=crop', alt: 'Skincare' },
    { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&h=1080&fit=crop', alt: 'Wireless earbuds' },
    { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1920&h=1080&fit=crop', alt: 'Gaming laptop' },
    { url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1920&h=1080&fit=crop', alt: 'Furniture set' },
    { url: 'https://images.unsplash.com/photo-1522943692186-69fda2fc7d1f?w=1920&h=1080&fit=crop', alt: 'Bags' },
    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920&h=1080&fit=crop', alt: 'Running shoes' },
    { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1920&h=1080&fit=crop', alt: 'Sunglasses collection' },
    { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1920&h=1080&fit=crop', alt: 'Smart TV' },
    { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=1920&h=1080&fit=crop', alt: 'Watch' },
    { url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1920&h=1080&fit=crop', alt: 'Sneakers' },
    { url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1920&h=1080&fit=crop', alt: 'Makeup brushes' },
    { url: 'https://images.unsplash.com/photo-1502657877623-f66bf489d236?w=1920&h=1080&fit=crop', alt: 'Jeans' },
    { url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1920&h=1080&fit=crop', alt: 'Watch display' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer>
      {/* SECTION 1: 30-IMAGE SLIDESHOW – fully visible on all devices */}
      <div className="relative w-full min-h-[350px] sm:min-h-[400px] md:min-h-[500px] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 w-full h-full">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-1000 ${
                idx === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.url}
                alt={slide.alt}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl font-bold">
                  <span className="text-white">Nexo</span>
                  <span className="text-brand-orange">Leolite</span>
                </span>
              </div>
              <p className="text-gray-200 text-sm mb-4">
                Africa's fastest growing marketplace. Buy and sell everything anywhere.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="p-2 bg-white/10 backdrop-blur rounded-lg text-white hover:bg-brand-orange transition">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-white/10 backdrop-blur rounded-lg text-white hover:bg-brand-orange transition">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-white/10 backdrop-blur rounded-lg text-white hover:bg-brand-orange transition">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-white/10 backdrop-blur rounded-lg text-white hover:bg-brand-orange transition">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/shop" className="text-gray-200 hover:text-brand-orange transition">Shop</Link></li>
                <li><Link to="/about" className="text-gray-200 hover:text-brand-orange transition">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-200 hover:text-brand-orange transition">Contact</Link></li>
                <li><Link to="/faq" className="text-gray-200 hover:text-brand-orange transition">FAQ</Link></li>
                <li><Link to="/terms" className="text-gray-200 hover:text-brand-orange transition">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-lg text-white mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><Link to="/shop?category=Electronics" className="text-gray-200 hover:text-brand-orange transition">Electronics</Link></li>
                <li><Link to="/shop?category=Fashion" className="text-gray-200 hover:text-brand-orange transition">Fashion</Link></li>
                <li><Link to="/shop?category=Home" className="text-gray-200 hover:text-brand-orange transition">Home & Garden</Link></li>
                <li><Link to="/shop?category=Beauty" className="text-gray-200 hover:text-brand-orange transition">Beauty</Link></li>
                <li><Link to="/shop?category=Sports" className="text-gray-200 hover:text-brand-orange transition">Sports</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-lg text-white mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200 text-sm"> Ikeja Lagos, Nigeria</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-brand-orange" />
                  <span className="text-gray-200">+234 81 263 328 66,+234 70 851 255 88</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-brand-orange" />
                  <span className="text-gray-200">nexoleolite@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 (unchanged) */}
      <div className="bg-gradient-to-br from-brand-orange/10 via-brand-light/30 to-white dark:from-brand-orange/20 dark:via-brand-dark/50 dark:to-gray-900 py-8 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              🚚 Free shipping on orders over ₦50,000
            </p>
            <div className="flex gap-6">
              <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="Visa" className="h-6 opacity-70" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="Mastercard" className="h-6 opacity-70" />
              <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="PayPal" className="h-6 opacity-70" />
              <span className="text-gray-500 text-sm">Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm"
              />
              <button className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition flex items-center gap-1">
                Subscribe <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 (unchanged) */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=1920&h=300&fit=crop" 
            alt="Marketplace, shopping bags"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-white/80 text-sm">
              &copy; {new Date().getFullYear()} NexoLeolite. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-white/80 hover:text-white text-sm transition">Privacy Policy</Link>
              <Link to="/terms" className="text-white/80 hover:text-white text-sm transition">Terms of Service</Link>
              <Link to="/sitemap" className="text-white/80 hover:text-white text-sm transition">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;