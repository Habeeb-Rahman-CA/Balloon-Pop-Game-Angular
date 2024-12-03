import { Component, computed, effect, OnInit, signal, viewChild, viewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BalloonsComponent } from "./components/balloons/balloons.component";
import { IBalloon } from './balloon.interface';
import { Balloon } from './balloon.class';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BalloonsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  balloonOnScreen = 3
  balloons: IBalloon[] = new Array(this.balloonOnScreen).fill(0).map(() => new Balloon())
  score = 0
  missed = signal(0)
  maxMissed = 10
  gameOver = computed(() => {
    return this.missed() == this.maxMissed
  })

  balloonElements = viewChildren(BalloonsComponent)

  createBalloonOnDemand = effect(() => {
    if (!this.gameOver() && this.balloonElements.length < this.balloonOnScreen) {
      this.balloons = [...this.balloons, new Balloon()]
    }
  })

  ngOnInit(): void {
      this.startGame()
  }

  startGame(){
    this.missed.set(0)
    this.score = 0
    this.balloons = new Array(this.balloonOnScreen).fill(0).map(() => new Balloon())
  }

  balloonPopHandler(balloonId: string) {
    this.score++
    this.balloons = this.balloons.filter(
      balloon => balloon.id !== balloonId
    )
    this.balloons = [...this.balloons, new Balloon()]
  }

  balloonMissHandler(balloonId: string) {
    this.missed.update((val) => val + 1)
    this.balloons = this.balloons.filter(
      balloon => balloon.id !== balloonId
    )
    this.balloons = [...this.balloons, new Balloon()]
  }

}
