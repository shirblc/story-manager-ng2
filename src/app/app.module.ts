/*
MIT License

Copyright (c) 2020 Shir Bar Lev

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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { ErrorPage } from './components/errorPage/errorPage.component';
import { LibraryManager } from './components/libraryManager/libraryManager.component';
import { StoryManager } from './components/storyManager/storyManager.component';
import { StoryEditor } from './components/storyEdit/storyEdit.component';
import { ChapterEditor } from './components/chapterEdit/chapterEdit.component';
import { Settings } from './components/settings/settings.component';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ServiceWorkerModule.register('sw.js'),
  ],
  declarations: [
    AppComponent,
    ErrorPage,
    LibraryManager,
    StoryManager,
    StoryEditor,
    ChapterEditor,
    Settings,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
