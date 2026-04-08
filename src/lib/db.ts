import { supabase } from './supabase';
import {
  FALLBACK_GALLERY_IMAGES,
  FALLBACK_TESTIMONIALS,
  type MenuItem,
  type Testimonial,
  type GalleryImage,
} from '../constants';

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('id');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchSignatureItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_signature', true)
    .order('id')
    .limit(4);
  if (error) throw new Error(error.message);
  // Map snake_case DB columns → camelCase interface
  return (data ?? []).map(mapMenuItem);
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
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

// Supabase stores snake_case; map to the MenuItem interface
function mapMenuItem(row: Record<string, unknown>): MenuItem {
  return {
    id: String(row.id),
    name: row.name as string,
    description: row.description as string,
    price: row.price as number,
    category: row.category as string,
    image: row.image as string,
    spiceLevel: row.spice_level as number,
    isSignature: row.is_signature as boolean | undefined,
  };
}
