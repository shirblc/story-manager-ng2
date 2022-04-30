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

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  activeServiceWorkerReg: ServiceWorkerRegistration | undefined;
  waitingServiceWorker: ServiceWorker | undefined;
  alert = {
    title: "",
    text: "",
    isServiceWorkerAlert: false,
  };

  constructor() {

  }

  // OnInit lifecycle method
  ngOnInit() {
    this.registerSW();
  }

  /*
  Function Name: registerSW()
  Function Description: Registers the ServiceWorker and then uses the ServiceWorkerRegistration
                        object to check for any updates to the currently active
                        ServiceWorker, as well as any ServiceWorker that is being installed.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  registerSW() {
    // if the service worker feature is supported in the current browser
    if('serviceWorker' in navigator) {
      // register the service worker
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        // if there's an active service worker, set the variable
        if(reg.active) {
          this.activeServiceWorkerReg = reg;
        }
        // if there's a waiting service worker ready to be activated,
        // alert the user; if they choose to refresh,
        else if(reg.waiting) {
          this.waitingServiceWorker = reg.waiting;
          this.toggleAlert(true, "Update", "A new version of the site is available. Click the reload button to update!", true);
        }
        // if there's a service worker installing
        else if(reg.installing) {
          let installingSW = reg.installing;
          this.checkSWChange(installingSW);
        }
        // otherwise wait for an 'updatefound' event
        else {
          reg.addEventListener('updatefound', () => {
            // gets the SW that was found and is now being installed
            let installingSW = reg.installing!;
            this.checkSWChange(installingSW);
          })
        }
      });
    }
  }

  /*
  Function Name: checkSWChange()
  Function Description: Upon a change in the state of the ServiceWorker, checks
                        the SW's state. If it's installed, it's ready to be activated,
                        so it triggers an alert for the user.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  checkSWChange(worker:ServiceWorker) {
    // wait for 'statechange' event on the SW being installed,
    // which means the SW has been installed and is ready to be activated
    worker.addEventListener('statechange', () => {
      if(worker.state == 'installed') {
        // if there's an active ServiceWorker, alert the user that there's
        // a new version of the site
        if(this.activeServiceWorkerReg && this.activeServiceWorkerReg!.active) {
          this.waitingServiceWorker = worker;
          this.toggleAlert(true, "Update", "A new version of the site is available. Click the reload button to update!", true);
        }
        // otherwise, just tell the SW to take over
        else {
          worker.postMessage({ action: 'skip waiting'});
        }
      }
    })
  }

  /*
  Function Name: checkSWChange()
  Function Description: Checks whether there's a new ServiceWorker installing,
                        installed or waiting to be activated. This event fires up
                        every time the user navigates to another page.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  updateSW() {
    if(this.activeServiceWorkerReg) {
      this.activeServiceWorkerReg.update().then(() => {
        // if there's a waiting service worker ready to be activated,
        // alert the user; if they choose to refresh,
        if(this.activeServiceWorkerReg!.waiting) {
          this.waitingServiceWorker = this.activeServiceWorkerReg!.waiting;
          this.toggleAlert(true, "Update", "A new version of the site is available. Click the reload button to update!", true);
        }
        // if there's a service worker installing
        else if(this.activeServiceWorkerReg!.installing) {
          let installingSW = this.activeServiceWorkerReg!.installing;
          this.checkSWChange(installingSW);
        }
        // otherwise wait for an 'updatefound' event
        else {
          this.activeServiceWorkerReg!.addEventListener('updatefound', () => {
            // gets the SW that was found and is now being installed
            let installingSW = this.activeServiceWorkerReg!.installing!;
            this.checkSWChange(installingSW);
          })
        }
      })
    }
  }

  /*
  Function Name: skipWaiting()
  Function Description: Alerts the waiting service worker to skip the wait and refresh.
  Parameters: None.
  ----------------
  Programmer: Shir Bar Lev.
  */
  skipWaiting() {
    // if the 'reload' came from a ServiceWorker-related popup, tell
    // the SW to skip waiting and activate the new SW
    this.waitingServiceWorker?.postMessage({ action: 'skip waiting'});
    // wait for the new serviceworker to take over, and when it does,
    // reload the page
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    })
  }

  /*
  Function Name: toggleAlert()
  Function Description: Toggles the alert on/off.
  Parameters: turnAlertOn (boolean) - whether to turn the alert on or off.
              title (string) - title for the alert.
              text (string) - text for the alert.
              isServiceWorkerAlert (boolean) - whether or not it's a SW alert
  ----------------
  Programmer: Shir Bar Lev.
  */
  toggleAlert(turnAlertOn: boolean, title: string, text: string, isServiceWorkerAlert: boolean) {
    this.alert = {
      title,
      text,
      isServiceWorkerAlert,
    };

    if(turnAlertOn) {
      document.querySelector('.alertMessage')!.classList.remove("off");
      document.querySelector('.alertMessage')!.classList.remove("off");
      document.querySelector('.alertMessage')!.classList.add("on");
    } else {
      document.querySelector('.alertMessage')!.classList.add("off");
      document.querySelector('.alertMessage')!.classList.remove("on");
      document.querySelector('.alertMessage')!.classList.add("off");
    }
  }
}
