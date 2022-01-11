'use strict';

export class Tag {
  id: number;
  name: string;
  idString: string
  // Ideas
  // Related tags
  related: Set<Tag>;

  constructor(name: string) {
    var newID = '';
    for (let index = 0; index < name.length; index++) {
      newID += name[index].charCodeAt(0).toString(2);
      if (index != name.length-1) newID += " ";
    }
    this.idString = newID;

    newID = newID.replace(/\s/g, "");

    this.id = Number(newID);

    this.name = name;
    this.related = new Set<Tag>();
  }
}
