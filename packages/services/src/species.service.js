import { apiClient } from './index';
const speciesService = {
    async getSpecies() {
        const { data } = await apiClient.get('/api/species');
        return data;
    },
    async getSpeciesById(id) {
        const { data } = await apiClient.get(`/api/species/${id}`);
        return data;
    },
};
export default speciesService;
