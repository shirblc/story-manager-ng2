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
  faCirclePlus = faCirclePlus;
  faCircleMinus = faCircleMinus;
  faTimesCircle = faTimesCircle;

  constructor(
    public librarianService:LibrarianService,
    public route: ActivatedRoute,
    private router: Router
  ) {
    this.storyId = Number(this.route.snapshot.paramMap.get("id")) || 1;
    this.storyDetails = this.librarianService.myStories[this.storyId-1];
  }

  /*
  Function Name: changeDetails()
  Function Description: Changes the name and synopsis of the story.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeDetails() {
    this.storyDetails.title = (document.getElementById("storyTitle") as HTMLInputElement).value;
    this.storyDetails.synopsis = (document.getElementById("storySynopsis") as HTMLInputElement).value;
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
  Function Name: openRemovePanel()
  Function Description: Opens the panel allowing the user to choose which chapters to delete.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  openRemovePanel() {
    document.querySelectorAll(".remove").forEach(function(chapter) {
      chapter.classList.add("on");
      chapter.classList.remove("off");
    })

    document.getElementById("doneBtn")!.classList.add("on");
    document.getElementById("doneBtn")!.classList.remove("off");
  }

  /*
  Function Name: closeRemovePanel()
  Function Description: Closes the panel allowing the user to choose which chapters to delete.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  closeRemovePanel() {
    document.querySelectorAll(".remove").forEach(function(chapter) {
      chapter.classList.add("off");
      chapter.classList.remove("on");
    })

    document.getElementById("doneBtn")!.classList.add("off");
    document.getElementById("doneBtn")!.classList.remove("on");
  }
}
