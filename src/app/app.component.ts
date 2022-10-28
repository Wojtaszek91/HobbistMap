import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from "leaflet";
import { icon, Icon, Marker } from "leaflet";
import { Subscription } from 'rxjs';
import { Position } from './position.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'map';

  selectedPosition: Position = {
    lat: 50.0602,
    long: 19.9374
  };
  mapSub: Subscription | undefined;

  private map!: L.Map;
  private marker!: Marker;
  private defaultIcon: Icon = icon({
    iconUrl: 'assets/localization.png',
    iconSize: [20, 20],
    iconAnchor: [0, 0],
    popupAnchor: [-3, -76]
  });

  private initMap(position: Position): void {
    this.map = L.map('map', {
      center: [position.lat, position.long],
      zoom: 12
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    if (this.marker === undefined) {
      this.marker = L.marker([position.lat, position.long], { draggable: true });
      this.marker.addTo(this.map);
    }

    // this.map.on("click", (e: any) => {
    //   if (this.marker != null) this.map.removeLayer(this.marker);
    //   this.marker = L.marker([e.latlng.lat, e.latlng.lng], { draggable: true });
    //   this.marker.addTo(this.map);
    // });
  }

  ngOnInit() {
    Marker.prototype.options.icon = this.defaultIcon;
    try {
      this.mapSub = this.route.queryParams.subscribe((params) => {
        if (params.lat && params.long) {
          this.selectedPosition = {
            lat: params.lat,
            long: params.long
          };
          this.initMap(this.selectedPosition);
        } else console.log('%cMissingQueryParams', 'color: red; font-size: 16px; font-weight: bold');
      });
    } catch (e) {
      console.log('%c' + e, 'color: red');
    }

  }

  ngOnDestroy(): void {
    if (this.mapSub) this.mapSub.unsubscribe();
  }

  constructor(private route: ActivatedRoute) { }

}
