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
import { FormControl } from '@angular/forms';

/* App-related imports */
import { Story } from '../../interfaces/story.interface';
import { Chapter } from '../../interfaces/chapter.interface';
import { LibrarianService } from '../../services/librarian.service';


@Component({
  selector: 'add-popup',
  templateUrl: './addPopup.component.html'
})
export class AddPopup implements OnChanges {
  @Input() showPopup: boolean = false;
  @Input() context: 'Story' | 'Chapter' = 'Story';
  // indicates whether the popup is still required
  @Output() editMode = new EventEmitter<boolean>();
  storyDetails?: Story;
  chapterIdFormCtrl: FormControl = new FormControl('');
  titleFormCtrl: FormControl = new FormControl('');
  synopsisFormCtrl: FormControl = new FormControl('');

  constructor(public librarianService:LibrarianService) {}

  ngOnChanges() {
    if(this.showPopup) {
      this.togglePopup(true);
    }
  }

  /*
  Function Name: addStory()
  Function Description: Adds a new story.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addStory() {
    let newStory: Story = {
      "id": this.librarianService.myStories[this.librarianService.myStories.length-1].id + 1,
      "title": this.titleFormCtrl.value,
      "synopsis": this.synopsisFormCtrl.value,
      "chapters": [] as Chapter[],
    };

    this.librarianService.addStory(newStory);
    this.togglePopup(false);
  }

  /*
  Function Name: addChapter()
  Function Description: Adds a new chapter.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addChapter() {
    //checks whether a number was entered for chapter number
    //if there was, places the chapter in the given place
    //it there wasn't, simply adds it at the end of the current chapters array
    var numChapter = (this.chapterIdFormCtrl.value)
      ? Number(this.chapterIdFormCtrl.value)
      : (this.librarianService.getStoryWithID(this.librarianService.getSelectedStoryNumber)!.chapters.length + 1);
    this.storyDetails = this.librarianService.getStoryWithID(this.librarianService.getSelectedStoryNumber)!;

    const chapter = {
      number: numChapter,
      title: this.titleFormCtrl.value,
      synopsis: this.synopsisFormCtrl.value,
    };

    this.librarianService.addChapter(chapter);

    //removes the modal box and popup
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
      document.getElementById("addPopUp")!.classList.remove("off");
      document.getElementById("addPopUp")!.classList.add("on");
    } else {
      document.getElementById("modalBox")!.className = "off";
      document.getElementById("addPopUp")!.classList.remove("on");
      document.getElementById("addPopUp")!.classList.add("off");
      this.editMode.emit(false);
    }
  }
}
