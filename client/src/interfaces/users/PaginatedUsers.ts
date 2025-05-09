import { Users } from './User';

export interface PaginatedUsers {
    data: Users[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}