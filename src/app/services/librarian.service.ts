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

  The provided Software is separate from the idea behind its website. The Send A Hug
  website and its underlying design and ideas are owned by Send A Hug group and
  may not be sold, sub-licensed or distributed in any way. The Software itself may
  be adapted for any purpose and used freely under the given conditions.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

// Angular imports
import { Injectable } from '@angular/core';

// App-related imports
import { Story } from '../interfaces/story.interface';
import { Chapter } from '../interfaces/chapter.interface';

@Injectable({
  providedIn: 'root'
})
export class LibrarianService {
  myStories: Story[] = []
  private currentlySelectedStory: number = 0;

  constructor() {

  }

  /*
  Function Name: getSelectedStoryNumber()
  Function Description: Returns the number of the currently selected story.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  get getSelectedStoryNumber(): number {
    return this.currentlySelectedStory;
  }

  /*
  Function Name: setSelectedStory()
  Function Description: Sets the number of the currently selected story.
  Parameters: numSelected - new selected story.
  ----------------
  Programmer: Shir Bar Lev.
  */
  set setSelectedStoryNumber(storyToSelect: number) {
    this.currentlySelectedStory = storyToSelect;
  }

  // STORY METHODS
  // ==============================================================
  /*
  Function Name: addStory()
  Function Description: Add a new story.
  Parameters: story (Story) - the newly added story.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addStory(story: Story) {
    this.myStories.push(story);
  }

  /*
  Function Name: deleteStory()
  Function Description: Delete a story.
  Parameters: storyId (number) - the ID of story to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteStory(storyId: number) {
    this.myStories = this.myStories.filter((story) => story.id != storyId);
  }

  /*
  Function Name: editStory()
  Function Description: Edit a story.
  Parameters: story (story) - the new details of the story.
              storyId (number) - the ID of story to edit.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editStory(story: Story, storyId: number) {
    // make sure the user isn't trying to change the ID
    if(storyId != story.id) return;

    this.myStories[storyId-1] = story;
  }

  // CHAPTER METHODS
  // ==============================================================
  /*
  Function Name: addChapter()
  Function Description: Add a chapter.
  Parameters: chapter (chapter) - the new chapter to be added.
  ----------------
  Programmer: Shir Bar Lev.
  */
  addChapter(chapter: Chapter) {
    this.myStories[this.currentlySelectedStory].chapters.push(chapter);
  }

  /*
  Function Name: deleteChapter()
  Function Description: Delete a chapter.
  Parameters: chapterNumber (number) - the number of chapter to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  deleteChapter(chapterNumber: number) {
    this.myStories[this.currentlySelectedStory].chapters.splice(chapterNumber-1, 1);
  }

  /*
  Function Name: editChapter()
  Function Description: Edit a chapter.
  Parameters: chapter (chapter) - the new details of the chapter.
              chapterNum (number) - the number of chapter to delete.
  ----------------
  Programmer: Shir Bar Lev.
  */
  editChapter(chapter: Chapter, chapterNum: number) {
    this.myStories[this.currentlySelectedStory].chapters[chapterNum-1] = chapter;
  }
}
