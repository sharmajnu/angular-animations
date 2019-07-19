import { animate, AnimationBuilder, AnimationPlayer, group, sequence, state, style, transition } from '@angular/animations';
import { Component, EventEmitter, Input, NgZone, Output, ViewChild, ElementRef } from '@angular/core';
import { calcTime } from './timer-calculator';



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
  fadeInTime: number;

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
  remaining: number;

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

    const pHeight = this.loadingBar.nativeElement.parentElement.scrollHeight;

    this.remaining = !this.remaining ? this.duration : this.remaining;

    const timer = calcTime(this.duration, pHeight, this.fullLineHeight, this.remaining);

    this.clearCurrentAnimations();

    this.loadingBar.nativeElement.style.top = `${timer.top}px`;

    const currentLineHeight = (timer.lineHeight === 0 ? this.initialLineHeight : timer.lineHeight);

    const scaleY = this.fullLineHeight / currentLineHeight;
    this.loadingBar.nativeElement.style.height = currentLineHeight + 'px';

    const factory = timer.top === 0 ? this._builder.build([
      sequence([
        animate(timer.timeToExpand, style({
          transform: `scale(1,${scaleY})`,
          'animation-fill-mode': 'forwards',
          'transform-origin': 'top'
        })
        ),
        animate(1, style({})),
        style({ height: this.fullLineHeightPx, transform: `scale(1,1)` }),
        animate(timer.timeToSlide, style({ transform: `translateY(${timer.pixelsToSlide}px)` }))
      ])
    ]) : 
    
    this._builder.build([
      sequence([
        style({ height: this.fullLineHeightPx, transform: `scale(1,1)` }),
        animate(timer.timeToSlide, style({ transform: `translateY(${timer.pixelsToSlide}px)` }))
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