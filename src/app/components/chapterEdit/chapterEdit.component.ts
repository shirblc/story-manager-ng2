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

/* App-related imports */
import { Story } from '../../interfaces/story.interface';
import { Chapter } from '../../interfaces/chapter.interface';
import { LibrarianService } from '../../services/librarian.service';


@Component({
  selector: 'chapter-editor',
  templateUrl: './chapterEdit.component.html'
})
export class ChapterEditor {
  storyDetails: Story;
  chapterDetails: Chapter;
  storyId: number = 1;

  constructor(
    public librarianService:LibrarianService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.storyId = Number(this.route.snapshot.paramMap.get("id")) || 1;
    let chapterId = this.route.snapshot.paramMap.get("chapterId") || 1;
    this.storyDetails = this.librarianService.myStories[this.storyId-1];
    this.chapterDetails = this.storyDetails.chapters[Number(chapterId)];
  }

  /*
  Function Name: changeChapterDetails()
  Function Description: Changes the name and synopsis of the selected chapter.
  Parameters: None
  ----------------
  Programmer: Shir Bar Lev.
  */
  changeChapterDetails() {
    const chapterNumber = Number((document.getElementById("chapterID") as HTMLInputElement).value);
    const chapterTitle = (document.getElementById("chapterTitle") as HTMLInputElement).value;
    const chapterSynopsis = (document.getElementById("chapterSynopsis") as HTMLInputElement).value;

    //checks whether the user changed the number of the chapter; if it's still the same
    //number, only updates the synopsis and title
    if(chapterNumber == this.chapterDetails.number) {
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
    this.router.navigate(['/story', this.storyId]);
  }

  /*
  Function Name: deleteItem()
  Function Description: Opens a popup to confirm whether to delete the selected item.
  Parameters: None
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteItem() {
    document.getElementById("modalBox")!.className = "on";
    document.getElementById("deletePopUp")!.classList.remove("off");
    document.getElementById("deletePopUp")!.classList.add("on");
  }

  /*
  Function Name: deleteChapter()
  Function Description: Deletes the chapter
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteChapter() {
    this.librarianService.deleteChapter(this.chapterDetails.number);
  }

  /*
  Function Name: closePopUp()
  Function Description: Aborts deletion and closes the popup.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  closePopUp() {
    document.getElementById("modalBox")!.className = "off";
    document.getElementById("deletePopUp")!.classList.add("off");
    document.getElementById("deletePopUp")!.classList.remove("on");
  }
}
