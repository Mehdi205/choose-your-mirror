import { CartItem } from './store';

export const ADMIN_WHATSAPP = '+212614606794'; // ⚠️ CHANGE CE NUMÉRO !

export const generateWhatsAppMessage = (
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  items: CartItem[],
  total: number
): string => {
  let message = `🪞 *NOUVELLE COMMANDE - Choose Your Mirror*\n\n`;
  message += `👤 *Client:* ${customerName}\n`;
  message += `📱 *Téléphone:* ${customerPhone}\n`;
  message += `📧 *Email:* ${customerEmail}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `🛍️ *PRODUITS COMMANDÉS:*\n\n`;
  
  let hasCustomItems = false;
  
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}*\n`;
    message += `   • Quantité: ${item.quantity}\n`;
    
    if (item.customization) {
      hasCustomItems = true;
      message += `   • ✨ *PERSONNALISATION:*\n`;
      message += `     ${item.customization}\n`;
      message += `   • Prix: À DISCUTER\n\n`;
    } else {
      message += `   • Prix unitaire: ${item.price} DH\n`;
      message += `   • Sous-total: ${item.price * item.quantity} DH\n\n`;
    }
  });
  
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  
  if (hasCustomItems) {
    message += `⚠️ *Cette commande contient des personnalisations*\n`;
    message += `Le prix final sera à discuter selon les demandes.\n\n`;
  }
  
  message += `💰 *TOTAL: ${total} DH*\n`;
  if (hasCustomItems) {
    message += `(+ prix des personnalisations à définir)\n`;
  }
  message += `\n✨ Merci de confirmer la disponibilité et le délai de livraison.`;
  
  return encodeURIComponent(message);
};

export const sendWhatsAppOrder = (
  adminPhone: string,
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  items: CartItem[],
  total: number
) => {
  const message = generateWhatsAppMessage(customerName, customerPhone, customerEmail, items, total);
  
  // Détection du système d'exploitation
  const userAgent = navigator.userAgent || navigator.vendor;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /android/i.test(userAgent);
  
  // URL WhatsApp adaptée selon la plateforme
  let whatsappUrl = '';
  
  if (isIOS) {
    // Pour iOS : utilise whatsapp:// ou https://wa.me
    whatsappUrl = `https://wa.me/${adminPhone}?text=${message}`;
    
    // Essayer d'ouvrir l'app WhatsApp d'abord
    const appUrl = `whatsapp://send?phone=${adminPhone}&text=${message}`;
    const startTime = Date.now();
    
    window.location.href = appUrl;
    
    // Fallback vers wa.me si l'app ne s'ouvre pas en 1.5 secondes
    setTimeout(() => {
      if (Date.now() - startTime < 2000) {
        window.location.href = whatsappUrl;
      }
    }, 1500);
  } else if (isAndroid) {
    // Pour Android
    whatsappUrl = `https://wa.me/${adminPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  } else {
    // Pour Desktop (web.whatsapp.com)
    whatsappUrl = `https://web.whatsapp.com/send?phone=${adminPhone}&text=${message}`;
    window.open(whatsappUrl, '_blank');
  }
};