import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css'
})
export class ClockComponent {

  protected time: Date = new Date();
  @Input() protected format: string = "HH";
  protected formattedTime: string = "";

  constructor() {

  }

  ngOnInit() {
    this.formattedTime = this.formatearFecha(this.format);
    setInterval(() => {
      this.time = new Date();
      this.formattedTime = this.formatearFecha(this.format);
    }, 1000);
  }

  formatearFecha(formato: string): string {
    const date = this.time;
    const map: Record<string, string | number> = {
      YYYY: date.getFullYear(),
      MM: String(date.getMonth() + 1).padStart(2, "0"),
      DD: String(date.getDate()).padStart(2, "0"),
      HH: String(date.getHours()).padStart(2, "0"),
      mm: String(date.getMinutes()).padStart(2, "0"),
      ss: String(date.getSeconds()).padStart(2, "0"),
    };

    return formato.replace(/YYYY|MM|DD|HH|mm|ss/g, matched => String(map[matched]));
  }
}
