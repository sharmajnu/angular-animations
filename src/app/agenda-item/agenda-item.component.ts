import { animate, AnimationBuilder, AnimationPlayer, group, sequence, state, style, transition } from '@angular/animations';
import { Component, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';



@Component({
  selector: 'app-agenda-item',
  templateUrl: './agenda-item.component.html',
  styleUrls: ['./agenda-item.component.css']
})
export class AgendaItemComponent {

  _state: 'not-started' | 'started' | 'nearlyCompleted' | 'completed' = 'not-started';


  public player: AnimationPlayer;

  @ViewChild('loadingBar', { static: true })
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

  initialLineHeight = 5;

  get initialLineHeightPx() {
    return this.initialLineHeight + 'px';
  }

  fullLineHeight = 20;
  get fullLineHeightPx() {
    return this.fullLineHeight + 'px';
  }

  handler: any;

  warningTime = 5000;

  setState(value) {
    this._state = value;

    clearTimeout(this.handler);


    if (value === 'not-started') {
      this.loadingBar.nativeElement.style.height = '0px';
      this.loadingBar.nativeElement.style.top = '0%';
      this.clearCurrentAnimations();

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

    this.clearCurrentAnimations();

    const topPercent = 100 - Math.round((remainingTime) * 100 / (this.duration - this.warningTime));

    const top = `${topPercent}%`;
    this.loadingBar.nativeElement.style.top = top;

    this.loadingBar.nativeElement.style.height = this.initialLineHeightPx;

    const pHeight = this.loadingBar.nativeElement.parentElement.scrollHeight;

    const slidingPercent = ((this.fullLineHeight - this.initialLineHeight) * 100 / pHeight);
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
        animate(expandTime, style({ height: this.fullLineHeightPx })),
        animate(slidingTime, style({ top: '100%' }))
      ])
    ]);
    this.player = factory.create(this.loadingBar.nativeElement, {});
    this.player.play();

    this.player.onDone(() => {

    });
  }


  runNearlyCompletedAnimation() {

    this.clearCurrentAnimations();

    this.loadingBar.nativeElement.style.top = '100%';
    this.loadingBar.nativeElement.style.height = this.fullLineHeightPx;

    const factory = this._builder.build([
      group([
        animate('1s', style({ background: '#ff6600' })),
        animate(this.warningTime, style({
          transform: `translateY(${this.fullLineHeightPx})`
        })),
        // animate(this.warningTime, style({ top: `calc(100% + ${this.fullLineHeightPx})` })),
        animate(this.warningTime, style({ height: '0px' }))
      ])
    ]);
    this.player = factory.create(this.loadingBar.nativeElement, {});
    this.player.play();

    this.player.onDone(() => {
      this.setState('completed');
    })

  }

  clearCurrentAnimations() {
    if (this.player) {
      this.player.destroy();
      this.player = undefined;
    }
  }
}