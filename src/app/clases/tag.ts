'use strict';
export class Tag {
  id: number;
  name: string;

  // Ideas
  // Related tags
  related: Set<Tag>;

  constructor(name: string) {
    var newID = '';
    for (let index = 0; index < name.length; index++) {
        newID += name.charCodeAt(index);
    }
    this.id = +newID;
    this.name = name;
    this.related = new Set<Tag>();
  }
}
