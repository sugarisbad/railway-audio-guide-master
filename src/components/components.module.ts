import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CityPlayerCard } from "./city-player-card/city-player-card";

@NgModule({
	declarations: [CityPlayerCard],
	imports: [IonicModule],
	exports: [CityPlayerCard]
})
export class ComponentsModule {}
