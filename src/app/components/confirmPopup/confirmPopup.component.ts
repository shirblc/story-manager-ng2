/*
MIT License

Copyright (c) 2022 Shir Bar Lev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* Angular imports */
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

/* App-related imports */
import { Story } from '../../interfaces/story.interface';
import { LibrarianService } from '../../services/librarian.service';


@Component({
  selector: 'confirm-popup',
  templateUrl: './confirmPopup.component.html'
})
export class ConfirmPopup implements OnChanges {
  @Input() showPopup: boolean = false;
  @Input() forDeletion?: String;
  // indicates whether the popup is still required
  @Output() editMode = new EventEmitter<boolean>();
  storyDetails?: Story;

  constructor(public librarianService:LibrarianService) {}

  ngOnChanges() {
    if(this.showPopup) {
      this.togglePopup(true);
    }
  }

  /*
  Function Name: deleteItem()
  Function Description: Deletes whatever the user asked to delete.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteItem() {
    const currentStory = this.librarianService.getStoryWithID(this.librarianService.getSelectedStoryNumber)!;
    switch (this.forDeletion) {
      //if the user requested to delete the story
      case currentStory.title:
        this.librarianService.deleteStory(currentStory.id);
        break;
      //if the user requested to delete all the chapters
      case "all chapters":
        currentStory.chapters = [];
        this.librarianService.editStory(currentStory, currentStory.id-1);
        break;
      //if it's not either of those, the user requested to delete a chapter
      default:
        let chapterNum = this.forDeletion?.substring(8);
        this.librarianService.deleteChapter(Number(chapterNum));
        break;
    }

    this.togglePopup(false);
  }

  /*
  Function Name: togglePopup()
  Function Description: Closes/opens the popup.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  togglePopup(shouldTurnOn: boolean) {
    if(shouldTurnOn) {
      document.getElementById("modalBox")!.className = "on";
      document.getElementById("deletePopUp")!.classList.remove("off");
      document.getElementById("deletePopUp")!.classList.add("on");
    } else {
      document.getElementById("modalBox")!.className = "off";
      document.getElementById("deletePopUp")!.classList.remove("on");
      document.getElementById("deletePopUp")!.classList.add("off");
      this.editMode.emit(false);
    }
  }
}
