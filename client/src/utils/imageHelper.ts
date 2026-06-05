/**
 * Image Helper - Maps product IDs to image files
 * All images are in public/assets/images/
 */

export function getProductImage(productId: string, imageIndex: number = 0): string {
  // Map of product IDs to image filenames
  const imageMap: { [key: string]: string[] } = {
    '1': ['a101_bbclc01_1_us.jpg'],
    '2': ['a101_bbcm01_1_us.jpg'],
    '3': ['a101_bbdh01_1_us.jpg'],
    '4': ['a101_bbevt01_1_us.jpg'],
    '5': ['a101_bbly01_1_us.jpg'],
    '6': ['a101_bbnp01_1_us.jpg'],
    '7': ['a101_bbosc01_1_us.jpg'],
    '8': ['a101_bbpklb01_1_us.jpg'],
    '9': ['a101_bbpst01_1_us.jpg'],
    '10': ['a101_bbrc01_1_us.jpg'],
  };

  const images = imageMap[productId];
  if (images && images[imageIndex]) {
    return `/assets/images/${images[imageIndex]}`;
  }

  // Return a random image from assets as fallback
  return getRandomProductImage();
}

/**
 * Get random product image from assets
 */
export function getRandomProductImage(): string {
  const commonImages = [
    'a101_bbclc01_1_us.jpg',
    'a101_bbcm01_1_us.jpg',
    'a101_bbdh01_1_us.jpg',
    '250thIDayPrep_C1_B1_0106-1406_US_CB_1920x380_Marketing_Material.jpg',
  ];

  const randomImage = commonImages[Math.floor(Math.random() * commonImages.length)];
  return `/assets/images/${randomImage}`;
}

/**
 * Get all available images for a category
 */
export function getImagesByCategory(category: string): string[] {
  // This can be expanded to map categories to image collections
  return [];
}

/**
 * Check if image exists
 */
export async function imageExists(path: string): Promise<boolean> {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
