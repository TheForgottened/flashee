'use strict';
export class Tag {
    id: number;
    name: string;

    // Ideas
    // Related tags
    related: Set<Tag>;

    constructor(id:number,name:string){
        this.id = id;
        this.name = name;
        this.related = new Set<Tag>();
    }
}