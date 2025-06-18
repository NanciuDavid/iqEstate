import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {authService} from '../services';
import {useAuth} from './useAuthQuery';


    export const useFavorites = () => {
        const { isAuthenticated } = useAuth();
        const queryClient = useQueryClient();
    
        const favoritesQuery = useQuery({
        queryKey: ['favorites'],
        queryFn: () => authService.getUserFavorites(),
        enabled: isAuthenticated,
        select: (data) => data.success ? data.data : []
        });
    
        const addToFavoritesMutation = useMutation({
        mutationFn: (propertyId: string) => authService.addToFavorites(propertyId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        }
        });
    
        const removeFromFavoritesMutation = useMutation({
        mutationFn: (propertyId: string) => authService.removeFromFavorites(propertyId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        }
        });
    
        return {
        favorites: favoritesQuery.data || [],
        isLoading: favoritesQuery.isLoading,
        error: favoritesQuery.error,
        addToFavorites: addToFavoritesMutation.mutate,
        removeFromFavorites: removeFromFavoritesMutation.mutate,
        isAddingToFavorites: addToFavoritesMutation.isPending,
        isRemovingFromFavorites: removeFromFavoritesMutation.isPending
        };
    };




