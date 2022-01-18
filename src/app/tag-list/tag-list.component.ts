import { Component, Input, OnInit } from '@angular/core';
import { Tag } from '../clases/tag';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'tag',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css'],
})
export class TagListComponent implements OnInit {
  @Input() tag!: Tag;

  constructor(public globalData: GlobalDataService) {}

  ngOnInit(): void {}

  searchByTag() {
    if (this.globalData.createQuiz) {
      let exists = false;

      for (let tag of this.globalData.tagsQuiz) {
        if (this.tag.id == tag.id) {
          exists = true;
        }
      }
      if (!exists)
        this.globalData.tagsQuiz.push(this.tag);
      return;
    }

    //console.log(this.tag.name);
    this.globalData.searchCards('Tag', this.tag.name, true);
  }
}
