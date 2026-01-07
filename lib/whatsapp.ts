import { CartItem } from './store';

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
  phoneNumber: string,
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  items: CartItem[],
  total: number
): void => {
  const message = generateWhatsAppMessage(customerName, customerPhone, customerEmail, items, total);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

// Numéro WhatsApp de l'administrateur (à modifier selon votre numéro)
export const ADMIN_WHATSAPP = '+212614606794'; // Format: code pays + numéro sans le 0
