import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastysoundService {

  constructor() { }

  private oscillatorType: OscillatorType = 'sine';
  private frequency: number = 430;

  notify() {
    const audioCtx = new AudioContext();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = this.oscillatorType;
    osc.frequency.value = this.frequency;

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00009, audioCtx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(0);
    osc.stop(audioCtx.currentTime + 1);
  }
}
