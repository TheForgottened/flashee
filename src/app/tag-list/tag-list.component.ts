import { Component, Input, OnInit } from '@angular/core';
import { Tag } from '../clases/tag';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'tag',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  @Input() tag!: Tag; 

  constructor(public globalData: GlobalDataService) { }

  ngOnInit(): void {
  }

  searchByTag() {
    this.globalData.searchCards("Tag", this.tag.name, true);
  }
}
