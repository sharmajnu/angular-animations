import { animate, AnimationBuilder, AnimationPlayer, group, sequence, state, style, transition } from '@angular/animations';
import { Component, EventEmitter, Input, NgZone, Output, ViewChild, ElementRef } from '@angular/core';



@Component({
  selector: 'app-agenda-item',
  templateUrl: './agenda-item.component.html',
  styleUrls: ['./agenda-item.component.css']
})
export class AgendaItemComponent {

  _state: 'not-started' | 'started' | 'nearlyCompleted' | 'completed' = 'not-started';


  public player: AnimationPlayer;

  @ViewChild('loadingBar', { static: true })
  public loadingBar: ElementRef;

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
      this.runSimpleStartAnimation(remainingTime);
      this.handler = setTimeout(() => {
        this.setState('nearlyCompleted');
        this.handler = undefined;
      }, remainingTime - this.warningTime)
    }

    // if (value === 'nearlyCompleted') {
    //   this.runSimpleNearlyCompletedAnimation();
    // }

    // if (value === 'completed') {
    //   this.runCompletedAnimation();
    // }
  }

  runSimpleStartAnimation(remainingTime?: number) {

    if (remainingTime === undefined) {
      remainingTime = this.duration;
    }

    this.clearCurrentAnimations();

    const topPercent = 100 - Math.round((remainingTime) * 100 / this.duration);
    this.loadingBar.nativeElement.style.top = `${topPercent}%`;

    this.loadingBar.nativeElement.style.height = this.fullLineHeightPx;
    this.loadingBar.nativeElement.style.opacity = 0;


    const pHeight = this.loadingBar.nativeElement.parentElement.scrollHeight;

    // const slidingPercent = ((this.fullLineHeight - this.initialLineHeight) * 100 / pHeight);


    const factory = this._builder.build([
      sequence([
        animate(2000, style({ opacity: 1 })),
        animate(remainingTime -4000, style({ transform: `translateY(${pHeight}px)` })),
        animate('2s', style({ opacity: 0 }))
      ])
    ]);
    this.player = factory.create(this.loadingBar.nativeElement, {});
    this.player.play();


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

  runSimpleNearlyCompletedAnimation() {

    this.clearCurrentAnimations();
    this.loadingBar.nativeElement.style.opacity = 1;

    const factory = this._builder.build([
      group([
        animate('1s', style({ background: '#ff6600' }))
      ])
    ]);
    this.player = factory.create(this.loadingBar.nativeElement, {});
    this.player.play();

    setTimeout(() => {
      this.setState('completed');
    }, this.warningTime);

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

  runCompletedAnimation() {

    const factory = this._builder.build([
      animate('3s', style({ opacity: 0 }))
    ]);
    this.player = factory.create(this.loadingBar.nativeElement, {});
    this.player.play();

  }

  clearCurrentAnimations() {
    if (this.player) {
      this.player.destroy();
      this.player = undefined;
    }
  }
}