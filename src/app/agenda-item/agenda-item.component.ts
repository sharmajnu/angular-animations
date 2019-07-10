import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
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
} from '@angular/animations';

@Component({
  selector: 'app-agenda-item',
  templateUrl: './agenda-item.component.html',
  styleUrls: ['./agenda-item.component.css']
})
export class AgendaItemComponent {

  _state: 'not-started' | 'started' | 'nearlyCompleted' | 'completed' = 'not-started';


  public player: AnimationPlayer;

  @ViewChild('loadingBar')
  public loadingBar;

  @Input()
  duration: number;

  @Output()
  durationChanged: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  set state(value) {
    this.setState(value);
  }

  get state() {
    return this._state;
  }

  @Input()
  itemNumber: number;

  @Input()
  isLastItem: boolean;

  constructor(private ngZone: NgZone,
    private _builder: AnimationBuilder) {
  }


  handler: number;

  warningTime = 5000;
  setState(value) {
    this._state = value;

    clearTimeout(this.handler);


    if (value === 'not-started') {
      this.loadingBar.nativeElement.style.height = '0px';
      this.loadingBar.nativeElement.style.top = '0%';


    }

    if (value === 'started') {
      const remainingTime = this.duration;
      this.runStartAnimation(remainingTime);
      this.handler = setTimeout(() => {
        this.setState('nearlyCompleted');
        this.handler = undefined;
      }, remainingTime - this.warningTime)
    }

    if (value === 'nearlyCompleted') {
      this.runNearlyCompletedAnimation();
    }
  }


  runStartAnimation(remainingTime?: number) {

    if (remainingTime === undefined) {
      remainingTime = this.duration;
    }

    remainingTime = remainingTime - this.warningTime;

    this.clearnCurrentAnimations();

    const topPercent = 100 - Math.round((remainingTime) * 100 / (this.duration - this.warningTime));

    const top = `${topPercent}%`;
    this.loadingBar.nativeElement.style.top = top;

    this.loadingBar.nativeElement.style.height = '0px';

    const pHeight = this.loadingBar.nativeElement.parentElement.scrollHeight;

    const slidingPercent = (30 * 100 / pHeight);
    const expandTime = (slidingPercent * remainingTime) / 100;

    const slidingTime = remainingTime - expandTime;
    const timer = {
      expandTime,
      duration: remainingTime,
      slidingTime
    };


    console.log(timer);

    const factory = this._builder.build([
      sequence([
        animate(expandTime, style({ height: '30px' })),
        animate(slidingTime, style({ top: '100%' }))
      ])
    ]);
    this.player = factory.create(this.loadingBar.nativeElement, {});
    this.player.play();

    this.player.onDone(() => {

    });
  }


  runNearlyCompletedAnimation() {

    this.clearnCurrentAnimations();

    this.loadingBar.nativeElement.style.top = '100%';
    this.loadingBar.nativeElement.style.height = '30px';


    if (!this.isLastItem) {

      const factory = this._builder.build([
        group([
          animate('5s', style({ top: 'calc(100% + 30px)' })),
          animate('5s', style({ height: '0px' }))
        ])
      ]);
      this.player = factory.create(this.loadingBar.nativeElement, {});
      this.player.play();

      this.player.onDone(() => {
        this.setState('completed');
      })
    } else {
      setTimeout(() => {
        this.setState('completed');
      }, 5000);
    }

  }

  clearnCurrentAnimations() {
    if (this.player) {
      this.player.destroy();
      this.player = undefined;
    }

  }
}