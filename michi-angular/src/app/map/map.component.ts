import { AfterViewInit, Component, inject, ɵɵNgOnChangesFeature } from '@angular/core';
import * as L from 'leaflet';
import { ShapeService } from '../shape.service';
import { GeoJsonObject } from 'geojson';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: any;
  shapeService: ShapeService = inject(ShapeService)
  private states: any ;
  private initMap(): void {
    this.map = L.map('map', {
      center: [ 
        -16.3528499935, -71.5453977763 ],
      zoom: 15
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private initStatesLayer() {
    const stateLayer = L.geoJSON(this.states, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.4,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#fc0317'
      }),
      onEachFeature: this.onEachFeature
    },
    

    )

    this.map.addLayer(stateLayer);
  }
  private onEachFeature(feature:any, layer:any){
    layer.bindPopup(`
    <div>
        <p><strong>OBJECTID:</strong> ${feature.properties.OBJECTID} </p>
        <p><strong>CODLOT:</strong> ${feature.properties.CODLOT}</p>
        <p><strong>ID_LOTE1:</strong> ${feature.properties.ID_LOTE1}</p>
        <p><strong>CODMZA:</strong> ${feature.properties.CODMZA}</p>
        <p><strong>CODSEC:</strong> ${feature.properties.CODSEC}</p>
      </div>
    `,
    {
      minWidth: 150
    })
  }
  ngAfterViewInit(): void { 
    this.initMap()
    this.shapeService.getStateShapes().subscribe(states => {
      this.states = states;
      this.initStatesLayer()
    });
  }
}
