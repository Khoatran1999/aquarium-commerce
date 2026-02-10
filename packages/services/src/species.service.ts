import { apiClient } from './index';
import type { FishSpecies, ApiResponse } from '@repo/types';

const speciesService = {
  async getSpecies(): Promise<ApiResponse<FishSpecies[]>> {
    const { data } = await apiClient.get('/api/species');
    return data;
  },

  async getSpeciesById(id: string): Promise<ApiResponse<FishSpecies>> {
    const { data } = await apiClient.get(`/api/species/${id}`);
    return data;
  },
};

export default speciesService;
