import { supabase } from './supabase';
import {
  FALLBACK_MENU_ITEMS,
  FALLBACK_GALLERY_IMAGES,
  FALLBACK_TESTIMONIALS,
  type GalleryImage,
  type MenuItem,
  type Testimonial,
} from '../constants';

function getFallbackSignatureItems() {
  return FALLBACK_MENU_ITEMS.filter(item => item.isSignature).slice(0, 4);
}

export async function fetchMenuItems(): Promise<MenuItem[]> {
  if (!supabase) return FALLBACK_MENU_ITEMS;

  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('id');

    if (error) {
      console.warn('Unable to load menu from Supabase. Using fallback menu items.', error.message);
      return FALLBACK_MENU_ITEMS;
    }

    const items = (data ?? []).map(mapMenuItem);
    return items.length ? items : FALLBACK_MENU_ITEMS;
  } catch (error) {
    console.warn('Unexpected menu fetch failure. Using fallback menu items.', error);
    return FALLBACK_MENU_ITEMS;
  }
}

export async function fetchSignatureItems(): Promise<MenuItem[]> {
  if (!supabase) return getFallbackSignatureItems();

  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_signature', true)
      .order('id')
      .limit(4);

    if (error) {
      console.warn('Unable to load signature items from Supabase. Using fallback signature items.', error.message);
      return getFallbackSignatureItems();
    }

    const items = (data ?? []).map(mapMenuItem);
    return items.length ? items : getFallbackSignatureItems();
  } catch (error) {
    console.warn('Unexpected signature menu fetch failure. Using fallback signature items.', error);
    return getFallbackSignatureItems();
  }
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  if (!supabase) return FALLBACK_TESTIMONIALS;

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('id');

    if (error) {
      console.warn('Unable to load testimonials from Supabase. Using fallback testimonials.', error.message);
      return FALLBACK_TESTIMONIALS;
    }

    return (data ?? []).length ? (data ?? []) : FALLBACK_TESTIMONIALS;
  } catch (error) {
    console.warn('Unexpected testimonials fetch failure. Using fallback testimonials.', error);
    return FALLBACK_TESTIMONIALS;
  }
}

export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  if (!supabase) return FALLBACK_GALLERY_IMAGES;

  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order');

    if (error) {
      console.warn('Unable to load gallery from Supabase. Using fallback gallery images.', error.message);
      return FALLBACK_GALLERY_IMAGES;
    }

    const images = (data ?? []).map(row => ({ url: row.url, title: row.title }));
    return images.length ? images : FALLBACK_GALLERY_IMAGES;
  } catch (error) {
    console.warn('Unexpected gallery fetch failure. Using fallback gallery images.', error);
    return FALLBACK_GALLERY_IMAGES;
  }
}

function mapMenuItem(row: Record<string, unknown>): MenuItem {
  return {
    id: String(row.id),
    name: String(row.name),
    description: String(row.description),
    price: Number(row.price),
    category: String(row.category),
    image: String(row.image),
    spiceLevel: Number(row.spice_level ?? row.spiceLevel ?? 0),
    isSignature: Boolean(row.is_signature ?? row.isSignature),
  };
}
