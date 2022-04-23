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
import { ActivatedRoute } from '@angular/router';

/* App-related imports */
import { Story } from '../../interfaces/story.interface';
import { LibrarianService } from '../../services/librarian.service';


@Component({
  selector: 'story-editor',
  templateUrl: './storyEdit.component.html'
})
export class StoryEditor {
  storyDetails: Story;
  toDelete: String = "";

  constructor(
    public librarianService:LibrarianService,
    public route: ActivatedRoute
  ) {
    let storyId = this.route.snapshot.paramMap.get("id") || 1;
    this.storyDetails = this.librarianService.myStories[Number(storyId)-1];
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
  }

  /*
  Function Name: openDeletePopup()
  Function Description: Opens a popup to confirm whether to delete the selected item.
  Parameters: toDelete - the item which needs to be deleted.
  ----------------
  Programmer: Shir Bar Lev.
  */
  openDeletePopup(toDelete: String) {
    document.getElementById("modalBox")!.className = "on";
    document.getElementById("deletePopUp")!.classList.remove("off");
    document.getElementById("deletePopUp")!.classList.add("on");
    this.toDelete = toDelete;
  }

  /*
  Function Name: deleteItem()
  Function Description: Deletes whatever the user asked to delete.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteItem() {
    switch (this.toDelete) {
      //if the user requested to delete the story
      case this.storyDetails.title:
        this.librarianService.deleteStory(this.storyDetails.id);
        break;
      //if the user requested to delete all the chapters
      case "all chapters":
        this.storyDetails.chapters = [];
        this.librarianService.editStory(this.storyDetails, this.storyDetails.id);
        break;
      //if it's not either of those, the user requested to delete a chapter
      default:
        let chapterNum = this.toDelete.substring(8);
        this.librarianService.deleteChapter(Number(chapterNum));
        break;
    }
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

    //if the delete popup is the one from which the function was called, the function hides
    //it.
    if(document.getElementById("deletePopUp")!.classList.contains("on"))
      {
        document.getElementById("deletePopUp")!.classList.add("off");
        document.getElementById("deletePopUp")!.classList.remove("on");
      }
    //if it wasn't the delete popup, it was the "add" popup, so the function
    //hides it instead
    else
      {
        document.getElementById("addPopUp")!.classList.add("off");
        document.getElementById("addPopUp")!.classList.remove("on");
      }
  }

  /*
  Function Name: openAddPanel()
  Function Description: Opens the panel allowing the user to insert the details for the new
            chapter.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  openAddPanel() {
    document.getElementById("modalBox")!.className = "on";
    document.getElementById("addPopUp")!.classList.remove("off");
    document.getElementById("addPopUp")!.classList.add("on");
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
    var numChapter = ((document.getElementById("chapterID") as HTMLInputElement).value)
      ? Number((document.getElementById("chapterID") as HTMLInputElement).value)
      : (this.storyDetails.chapters.length + 1);

    //checks if there's already a chapter there
    //if there is
    if(this.storyDetails.chapters[numChapter-1])
      {
        this.storyDetails.chapters.splice(numChapter-1, 0, {
          number: numChapter,
          title: (document.getElementById("chapterTitle") as HTMLInputElement).value,
          synopsis: (document.getElementById("chapterSynopsis") as HTMLInputElement).value,
        });

        this.storyDetails.chapters.forEach(function(chapter, index) {
          chapter.number = index + 1;
        });
      }
    //if there isn't
    else
      {
        //adds the chapter to the array in the story controller and sends it to the librarian
        this.storyDetails.chapters.push({
          number: numChapter,
          title: (document.getElementById("chapterTitle") as HTMLInputElement).value,
          synopsis: (document.getElementById("chapterSynopsis") as HTMLInputElement).value,
        });
      }

    this.librarianService.editStory(this.storyDetails, this.storyDetails.id);

    //removes the modal box and popup
    document.getElementById("modalBox")!.className = "off";
    document.getElementById("addPopUp")!.classList.add("off");
    document.getElementById("addPopUp")!.classList.remove("on");
  }
}
