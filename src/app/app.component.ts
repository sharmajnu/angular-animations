import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { AnimationBuilder, AnimationPlayer } from "@angular/animations";
import { calcTime} from './agenda-item/timer-calculator';


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
import { AgendaItemComponent } from './agenda-item/agenda-item.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
     this.pixelsToMove = (this.item1 as any).loadingBar.nativeElement.parentElement.scrollHeight;
  }

  constructor(private ngZone: NgZone,
    private _builder: AnimationBuilder
  ) {

  }

  @ViewChild('item1', {static: true})
  public item1: ElementRef;

  state1 = 'not-started';
  state2 = 'not-started';

  duration1 = 120000;
  duration2 = 300000;

  remaining = 100000;

  lineHeight = 20;

  pixelsToMove = 100;


  fadeInTime = 600;

  timeout2;
  start() {

    this.reset();

    setTimeout(() => {

      this.state1 = 'started';

      this.timeout2 = setTimeout(() => {
        this.state2 = 'started';
      }, this.duration1);

    }, 0);


  }


  reset() {
    this.state1 = 'not-started';
    this.state2 = 'not-started';

    clearTimeout(this.timeout2);
    this.timeout2 = undefined;

  }

  durationChanged(v) {

  }

  calculate() {
    const r  = calcTime(+this.duration1, +this.pixelsToMove, this.lineHeight, this.remaining );

    console.log(r);
  }

  test1() {
    this.duration1 = 100;
    this.pixelsToMove = 100;
    this.remaining = 100;
    this.lineHeight = 20;
  }

  test2() {
    this.duration1 = 50;
    this.pixelsToMove = 20;
    this.remaining = 40;
    this.lineHeight = 10;
  }

  test3() {
    this.duration1 = 50;
    this.pixelsToMove = 180;
    this.remaining = 50;
    this.lineHeight = 20;
  }
}
