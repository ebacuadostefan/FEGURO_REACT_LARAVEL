import { Users } from '../users/Users';

export interface PaginatedUsers {
    data: Users[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}