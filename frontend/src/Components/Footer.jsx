import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
<footer className="bg-gradient-to-r from-orange-100 via-yellow-50 to-orange-100 text-gray-800 py-8">
      <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">
        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg mb-2">Quick Links</h3>
          <a href="/" className="hover:text-orange-500 transition-colors">
            Home
          </a>
          <a href="/favorites" className="hover:text-orange-500 transition-colors">
            Favorites
          </a>
        </div>

        {/* Social Media */}
        <div className="flex flex-col gap-2 items-start">
          <h3 className="font-bold text-lg mb-2">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-500 transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-left md:text-right mt-4 md:mt-0">
          <p>© 2025 FoodFusion Hub. All rights reserved.</p>
          <p className="mt-1 text-sm">
            Made with <span className="text-red-500">❤️</span> by Hafiza Aqsa
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
