export interface Restaurant {
    name: string;
    address: string;
    phone: string;
}
export declare function getAllRestaurants(): Restaurant[];
export declare function getRestaurantByName(name: string): Restaurant | null;
export declare function addRestaurant(newRestaurant: Restaurant): Restaurant | null;
export declare function deleteRestaurant(name: string): Restaurant;
export declare function updateRestaurant(updatedRestaurant: Restaurant): Restaurant;
//# sourceMappingURL=restaurantService.d.ts.map