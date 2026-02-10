import { useQuery } from '@tanstack/react-query';
import { speciesService } from '@repo/services';
import { queryKeys } from './queryKeys';

/** All fish species */
export function useSpeciesList() {
  return useQuery({
    queryKey: queryKeys.species.all,
    queryFn: () => speciesService.getSpecies(),
  });
}

/** Single species by id */
export function useSpeciesDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.species.detail(id),
    queryFn: () => speciesService.getSpeciesById(id),
    enabled: !!id,
  });
}
