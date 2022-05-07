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
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { faCirclePlus, faCircleMinus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

/* App-related imports */
import { Story } from '../../interfaces/story.interface';
import { Chapter } from '../../interfaces/chapter.interface';
import { LibrarianService } from '../../services/librarian.service';


@Component({
  selector: 'story-editor',
  templateUrl: './storyEdit.component.html'
})
export class StoryEditor {
  storyId = 0;
  storyDetails: Story;
  editedChapter?: Chapter;
  showAddPopup = false;
  showDeletePopup = false;
  toDelete: String = "";
  storyTitleFormCtrl: FormControl = new FormControl('');
  storySynopsisFormCtrl: FormControl = new FormControl('');
  chapterIdFormCtrl: FormControl = new FormControl('');
  chapterTitleFormCtrl: FormControl = new FormControl('');
  chapterSynopsisFormCtrl: FormControl = new FormControl('');
  faCirclePlus = faCirclePlus;
  faCircleMinus = faCircleMinus;
  faTimesCircle = faTimesCircle;

  constructor(
    public librarianService:LibrarianService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    this.storyId = Number(this.route.snapshot.paramMap.get("id")) || 1;
    this.storyDetails = this.librarianService.getStoryWithID(this.storyId)!;
    this.editedChapter = undefined;
    this.librarianService.setSelectedStoryNumber = this.storyId;
    this.storyTitleFormCtrl.setValue(this.storyDetails.title);
    this.storySynopsisFormCtrl.setValue(this.storyDetails.synopsis);
    let chapterId = this.route.snapshot.paramMap.get("chapterId");
    if(chapterId) {
      this.startChapterEdit(this.storyDetails.chapters.find(c => c.number == Number(chapterId))!);
    }
  }

  /*
  Function Name: changeDetails()
  Function Description: Changes the name and synopsis of the story.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeDetails() {
    this.storyDetails.title = this.storyTitleFormCtrl.value;
    this.storyDetails.synopsis = this.storySynopsisFormCtrl.value;
    this.librarianService.editStory(this.storyDetails, this.storyDetails.id);
    this.router.navigate(['/stories', this.storyDetails.id]);
  }

  /*
  Function Name: openDeletePopup()
  Function Description: Opens a popup to confirm whether to delete the selected item.
  Parameters: toDelete - the item which needs to be deleted.
  ----------------
  Programmer: Shir Bar Lev.
  */
  openDeletePopup(toDelete: string) {
    this.showDeletePopup = true;
    this.toDelete = toDelete;
  }

  /*
  Function Name: refetchAfterEdit()
  Function Description: Refetches data after adding a chapter.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  refetchAfterEdit() {
    this.showAddPopup = false;
    this.storyDetails = this.librarianService.getStoryWithID(this.librarianService.getSelectedStoryNumber)!
  }

  /*
  Function Name: redirectAfterDelete()
  Function Description: Redirects the user after deleting a story/some chapters. If
                        the user deleted the story, they're redirected back to the Home
                        page; otherwise they're sent back to the story's page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  redirectAfterDelete() {
    this.showDeletePopup = false;

    if(this.toDelete == this.storyDetails.title) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/stories', this.storyId]);
    }
  }

  /*
  Function Name: toggleRemovePanel()
  Function Description: Opens/closes the panel allowing the user to choose which chapters to delete.
  Parameters: turnOn (boolean) - whether to turn the popup on or off.
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleRemovePanel(turnOn: boolean) {
    const addClass = turnOn ? "on" : "off";
    const removeClass = turnOn ? "off" : "on";

    document.querySelectorAll(".remove").forEach(function(chapter) {
      chapter.classList.add(addClass);
      chapter.classList.remove(removeClass);
    })

    document.getElementById("doneBtn")!.classList.add(addClass);
    document.getElementById("doneBtn")!.classList.remove(removeClass);
  }

  /*
  Function Name: startChapterEdit()
  Function Description: triggers chapter edit mode
  Parameters: chapter (Chapter) - the chapter to edit
  ----------------
  Programmer: Shir Bar Lev.
  */
  startChapterEdit(chapter: Chapter) {
    this.editedChapter = chapter;
    this.chapterIdFormCtrl.setValue(this.editedChapter.number);
    this.chapterTitleFormCtrl.setValue(this.editedChapter.title);
    this.chapterSynopsisFormCtrl.setValue(this.editedChapter.synopsis);
  }

  /*
  Function Name: changeChapterDetails()
  Function Description: Changes the name and synopsis of the selected chapter.
  Parameters: None
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeChapterDetails() {
    const chapterNumber = Number(this.chapterIdFormCtrl.value);
    const chapterTitle = this.chapterTitleFormCtrl.value;
    const chapterSynopsis = this.chapterSynopsisFormCtrl.value;

    //checks whether the user changed the number of the chapter; if it's still the same
    //number, only updates the synopsis and title
    if(chapterNumber == this.editedChapter?.number) {
      this.storyDetails.chapters[chapterNumber-1].title = chapterTitle;
      this.storyDetails.chapters[chapterNumber-1].synopsis = chapterSynopsis;
    //if the number changed, moves the chapter
    } else {
      //checks whether there's already a chapter there
      //if there is
      if(this.storyDetails.chapters[chapterNumber-1]) {
        this.storyDetails.chapters.splice(chapterNumber-1, 0, {
          number: chapterNumber,
          title: chapterTitle,
          synopsis: chapterSynopsis,
        })

        this.storyDetails.chapters.forEach((chapter, index) => {
          if(chapter.number != index + 1) {
            chapter.number += 1;
          }
        });
      //if there isn't
      } else {
        this.storyDetails.chapters[chapterNumber-1].number = chapterNumber;
        this.storyDetails.chapters[chapterNumber-1].title = chapterTitle;
        this.storyDetails.chapters[chapterNumber-1].synopsis = chapterSynopsis;
      }
    }

    this.librarianService.editStory(this.storyDetails, this.storyDetails.id);
    this.editedChapter = undefined;
    this.router.navigate(['/stories', this.storyId]);
  }
}
