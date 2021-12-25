'use strict';
export interface Tag {
    id: number;
    name: string;

    // Ideas
    // Related tags
    related: Tag[];
}