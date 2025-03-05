// src/routes/sketches/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  // Get the sketch ID from the URL parameters
  const id = params.id;
  
  // Check if the ID is valid
  if (!id || isNaN(parseInt(id))) {
    throw error(400, 'Invalid sketch ID');
  }
  
  return {
    id: parseInt(id)
  };
};
