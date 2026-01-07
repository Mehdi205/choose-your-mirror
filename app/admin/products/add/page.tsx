'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated, addProduct } from '@/lib/store';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [] as string[],
    customizable: false
  });
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const product = await addProduct({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      images: formData.images,
      customizable: formData.customizable
    });

    if (product) {
      alert('✨ Produit ajouté avec succès !');
      router.push('/admin/dashboard');
    } else {
      alert('❌ Erreur lors de l\'ajout du produit');
    }
  };

  const addImageUrl = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] });
      setImageUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner uniquement des images');
        setIsUploading(false);
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('L\'image est trop grande (max 2MB)');
        setIsUploading(false);
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64]
        }));
        setIsUploading(false);
      };

      reader.onerror = () => {
        alert('Erreur lors du chargement de l\'image');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <div className="min-h-screen bg-luxury-darkNavy">
      <div className="bg-gradient-navy border-b border-luxury-gold/20">
        <div className="container mx-auto px-4 py-4">
          <Link href="/admin/dashboard" className="flex items-center space-x-2 text-luxury-gold hover:text-luxury-lightGold">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="card-luxury">
            <h1 className="text-3xl font-serif text-luxury-gold mb-8">Ajouter un Produit</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-luxury-lightGold/70 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-luxury"
                  placeholder="Miroir Élégance Dorée"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-luxury-lightGold/70 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-luxury min-h-[120px] resize-y"
                  placeholder="Description détaillée du produit..."
                />
              </div>

              <div>
                <label className="block text-sm text-luxury-lightGold/70 mb-2">
                  Catégorie *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-luxury"
                  placeholder="Premium, Moderne, Vintage..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-luxury-lightGold/70 mb-2">
                    Prix (DH) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-luxury"
                    placeholder="2500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-luxury-lightGold/70 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input-luxury"
                    placeholder="10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.customizable}
                    onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })}
                    className="w-5 h-5 rounded border-luxury-gold/30 bg-luxury-navy text-luxury-gold focus:ring-luxury-gold focus:ring-2"
                  />
                  <span className="text-luxury-lightGold/70">
                    Produit personnalisable
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm text-luxury-lightGold/70 mb-2">
                  Images du produit
                </label>
                
                <div className="mb-4">
                  <label className="btn-secondary cursor-pointer inline-flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5" />
                    <span>
                      {isUploading ? 'Chargement...' : 'Choisir depuis mon PC'}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  <p className="text-xs text-luxury-lightGold/50 mt-2">
                    Max 2MB par image • JPG, PNG, WebP
                  </p>
                </div>

                <div className="flex items-center space-x-4 my-4">
                  <div className="flex-1 border-t border-luxury-gold/20"></div>
                  <span className="text-luxury-lightGold/50 text-sm">OU</span>
                  <div className="flex-1 border-t border-luxury-gold/20"></div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="input-luxury flex-1"
                    placeholder="https://exemple.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="btn-secondary px-6"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" className="btn-primary flex-1">
                  Ajouter le Produit
                </button>
                <Link href="/admin/dashboard" className="btn-secondary flex-1 text-center">
                  Annuler
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}