import { Component, ViewChild } from '@angular/core';
import { NgZone } from '@angular/core';
import { AnimationBuilder, AnimationPlayer } from "@angular/animations";



import {
  trigger,
  state,
  style,
  animate,
  transition,
  group,
  sequence,
  AnimationEvent

  // ...
} from '@angular/animations';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private ngZone: NgZone,
    private _builder: AnimationBuilder
  ) {

  }

  state1 = 'not-started';
  state2 = 'not-started';

  duration1 = 15000;
  duration2 = 15000;



  timeout2;
  start() {

    this.reset();
    this.state1 = 'started';

    this.timeout2 = setTimeout(() => {
      this.state2 = 'started';
    }, this.duration1)

  }


  reset() {
    this.state1 = 'not-started';
    this.state2 = 'not-started';

    clearTimeout(this.timeout2);
    this.timeout2 = undefined;

  }

durationChanged(v) {
  
}

}
