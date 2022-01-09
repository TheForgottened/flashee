'use strict';

import { Byte } from "@angular/compiler/src/util";

//import { Buffer } from 'buffer';
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

    //console.log(String.fromCharCode(+newID))
    newID = newID.replace(/\s/g, "");

    //console.log(newID);

    this.id = Number(newID);
    //console.log("asdasd");
    //console.log(this.id);
    this.name = name;
    this.related = new Set<Tag>();
  }
}
