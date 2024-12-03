import { Component, ElementRef, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { IBalloon } from '../../balloon.interface';
import { animate, animation, AnimationBuilder, keyframes, style, transition } from '@angular/animations';

@Component({
  selector: 'app-balloons',
  standalone: true,
  imports: [],
  templateUrl: './balloons.component.html',
  styleUrl: './balloons.component.css'
})
export class BalloonsComponent implements OnInit {

  balloon = input.required<IBalloon>()
  animBuilder = inject(AnimationBuilder)
  elementRef = inject(ElementRef)
  @Output() balloonPopped = new EventEmitter<string>()
  @Output() balloonMissed = new EventEmitter()

  ngOnInit(): void {
    this.animateBalloon()
  }

  animateBalloon() {
    const buffer = 20
    const maxWidth = window.innerWidth - this.elementRef.nativeElement.firstChild.clientWidth + buffer
    const leftPostion = Math.floor(Math.random() * maxWidth )
    const minSpeed = 2
    const speedVariation = 3
    const speed = minSpeed + Math.random() * speedVariation
    const flyAnimation = this.animBuilder.build([
      style({
        translate: `${leftPostion}px 0`,
        position: 'fixed',
        left: 0,
        bottom: 0
      }),
      animate(
        `${speed}s ease-in`,
        style({
          translate: `${leftPostion}px -100vh`
        }))
    ])

    const player = flyAnimation.create(this.elementRef.nativeElement.firstChild)
    player.play()
    player.onDone(() => this.balloonMissed.emit(this.balloon().id))
  }

  pop(){
    const popAnimation = this.animBuilder.build([
      animate(
        '0.2s ease-out',
        keyframes([
          style({
            scale: '1.2',
            offset: 0.5
          }),
          style({
            scale: '0.8',
            offset: 0.75
          }),
        ])
      )
    ])
    const player = popAnimation.create(this.elementRef.nativeElement.firstChild)
    player.play()
    player.onDone(() => {
      this.balloonPopped.emit(this.balloon().id)
    })
  }


}
