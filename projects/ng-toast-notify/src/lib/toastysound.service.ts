import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastysoundService {

  constructor() { }

  private oscillatorType: OscillatorType = 'sine';
  private frequency: number = 430;
  private audioCtx: AudioContext = new AudioContext();

  notify() {
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = this.oscillatorType;
    osc.frequency.value = this.frequency;

    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00009, this.audioCtx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(0);
    osc.stop(this.audioCtx.currentTime + 1);
  }
}
