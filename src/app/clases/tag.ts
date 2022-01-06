'use strict';
export class Tag {
    id?: number;
    name: string;

    // Ideas
    // Related tags
    related: Set<Tag>;

    constructor(name:string){
        this.name = name;
        this.related = new Set<Tag>();
    }
}