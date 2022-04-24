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
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

/* App-related imports */
import { Story } from '../../interfaces/story.interface';
import { Chapter } from '../../interfaces/chapter.interface';
import { LibrarianService } from '../../services/librarian.service';


@Component({
  selector: 'library-manager',
  templateUrl: './libraryManager.component.html'
})
export class LibraryManager {
  currentStory?: Story;
  faCirclePlus = faCirclePlus;

  constructor(public librarianService:LibrarianService) {

  }

  /*
  Function Name: openAdd()
  Function Description: Opens the "add story" popup.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  openAdd() {
    document.getElementById("modalBox")!.className = "on";
    document.getElementById("addPopUp")!.classList.remove("off");
    document.getElementById("addPopUp")!.classList.add("on");
  }

  /*
  Function Name: addStory()
  Function Description: Adds a new story.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addStory() {
    let newStory = {
      "id": this.librarianService.myStories.length,
      "title": (document.getElementById("storyTitle") as HTMLInputElement).value,
      "synopsis": (document.getElementById("storySynopsis") as HTMLInputElement).value,
      "chapters": [] as Chapter[],
    };

    this.librarianService.addStory(newStory);

    document.getElementById("modalBox")!.className = "off";
    document.getElementById("addPopUp")!.classList.remove("on");
    document.getElementById("addPopUp")!.classList.add("off");
  }

  /*
  Function Name: closePopUp()
  Function Description: Closes the popup without adding a new story.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  closePopUp() {
    document.getElementById("modalBox")!.className = "off";
    document.getElementById("addPopUp")!.classList.remove("on");
    document.getElementById("addPopUp")!.classList.add("off");
  }
}
