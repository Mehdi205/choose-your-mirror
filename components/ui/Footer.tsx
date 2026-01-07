'use client';

import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-navy border-t border-luxury-gold/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-luxury-gold">Choose Your Mirror</h3>
            <p className="text-luxury-lightGold/70 text-sm">
              Créateur de miroirs personnalisés haut de gamme. Chaque pièce est une œuvre d'art unique.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-luxury-gold">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-luxury-lightGold/70 hover:text-luxury-gold transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-luxury-lightGold/70 hover:text-luxury-gold transition-colors text-sm">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-luxury-lightGold/70 hover:text-luxury-gold transition-colors text-sm">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-luxury-gold">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-luxury-lightGold/70 text-sm">
                <Phone className="w-4 h-4 text-luxury-gold" />
                <span>+212 6XX XX XX XX</span>
              </li>
              
              <li className="flex items-center space-x-2 text-luxury-lightGold/70 text-sm">
                <MapPin className="w-4 h-4 text-luxury-gold" />
                <span>Casablanca, Maroc</span>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-luxury-gold">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/choose_your_mirror/?igsh=dTRyMzcweWdqbzVw" 
                className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center hover:bg-luxury-gold/20 hover:border-luxury-gold transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-luxury-gold" />
              </a>
              
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-luxury-gold/20 mt-8 pt-8 text-center">
          <p className="text-luxury-lightGold/50 text-sm">
            © {new Date().getFullYear()} Choose Your Mirror. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
