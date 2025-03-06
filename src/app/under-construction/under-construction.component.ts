import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrls: ['./under-construction.component.css']
})
export class UnderConstructionComponent implements OnInit {

  ngOnInit() {
    this.updateClock();
    setInterval(() => this.updateClock(), 60000); // Update every minute
  }

  updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    const timeString = hours + ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ' ' + ampm;

    const clockElement = document.getElementById('clock');
    if (clockElement) {
      clockElement.textContent = timeString;
    }
  }
}
