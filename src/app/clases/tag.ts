'use strict';
import { Guid } from 'guid-typescript';

export class Tag {
  id: string;
  name: string;
  idString?: string
  numberExisting: number;
  // Ideas
  // Related tags
  related: Set<Tag>;

  constructor(name: string) {
    this.id = name;
    this.name = name;
    this.related = new Set<Tag>();
    this.numberExisting = 0;
  }
}
