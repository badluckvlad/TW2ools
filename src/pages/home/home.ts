import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [DataProvider]
})
export class HomePage {

  public current: any;
  public buildings: any;

  public headquarters = this.getBuilding("headquarters");
  public farm = this.getBuilding("farm");
  public warehouse = this.getBuilding("warehouse");
  public tavern = this.getBuilding("tavern");

  constructor(
    public navCtrl: NavController,
    public provider: DataProvider
  ) {
    this.init();
    console.log(this.current);
  }

  init() {
    this.buildings = this.provider.data;
    this.current = {
      "buildings": {

        "headquarters": 1,
        "farm": 1,
        "warehouse": 1,
        "tavern": 1,
      },
      /*
      "timber_camp": 0,
      "clay_pit": 0,
      "iron_mine": 0,
      "church": 0,
      "rally_point": 0,
      "barracks": 0,
      "statue": 0,
      "wall": 0,
      "hospital": 0,
      "market": 0,
      "academy": 0,
      "hall_of_orders": 0,
      */
      "total_capacity": 0,
      "provisions_total": 0,
      "provisions_used": 0,
      "provisions_free": 0
    }
  }

  //Iterates through data provider
  //Param type STR
  //Returns OBJ

  getBuilding(building) {
    let buildings = this.provider.data;
    for (let i = 0; i < buildings.length; i++) {
      if (buildings[i].name == building) {
        return buildings[i];
      }
    }

  }

  //Checks all requirements for current building level and sets values accordingly
  //function(STR, INT)
  //returns INT

  checkRequirements(building, level) {
    this.checkRequiredHeadquarters(building);
    this.current.buildings.headquarters = this.checkRequiredHeadquarters(building);
    this.checkRequiredWarehouse(building, level);
    this.checkRequiredFarm(building, level);
  }

  checkMinMax(building, level) {
    console.log(this.building.min_level);
    console.log(this.farm.max_level);
    if (this.current.buildings.building < 0 || this.current.buildings.building == "") {
      this.current.buildings.building = 0;
    } 
    if (this.current.buildings.building > 30) {
      this.current.buildings.building = 30;
    }
    console.log(this.current.buildings.building);
  }

  //Checks required headquarters level for current building
  //function(STR)
  //Returns INT

  checkRequiredHeadquarters(building) {
    if (building.required.hq) {
      if (building.required.hq > this.current.buildings.headquarters) {
        return building.required.hq;
      }
    }
  }

  checkRequiredWarehouse(building, level) {
    let target = building.required.resources[level - 1];
    let req_resources = [];
    let req_capacity = 0;

    for (let i = 0; i < target.length; i++) {
      req_resources[i] = target[i];
      req_capacity = Math.max(...req_resources);
    }
    if (req_capacity > this.warehouse.capacity[0]) {
      for (let j = 0; j < this.warehouse.capacity.length; j++) {
        if (req_capacity < this.warehouse.capacity[j]) {
          this.current.total_capacity = this.warehouse.capacity[j];
          return this.current.buildings.warehouse = j + 1;
        }
      }
    }
  }


  checkRequiredFarm(building, level) {
    let target = building.required.provisions[level - 1];
    let req_farm = 0;
    let total_provisions = this.getTotalProvisions();
    this.current.provisions_total = total_provisions;
    let req_provisions = this.getRequiredProvisions();
    this.current.provisions_used = req_provisions;
    let free_provisions = total_provisions - req_provisions;;
    this.current.provisions_free = free_provisions;
    if (this.checkProvisions()) {
      console.log('here');
    }
  }

  //Checks if required provisions exceed free provisions
  //Returns BOOL

  checkProvisions() {
    if (this.current.provisions_free < 0) {
      return true;
    }
  }

  //Calculates total provisions needed for current configuration
  //Returns INT

  getRequiredProvisions() {
    let total_req_prov = 0;
    for (let i in this.current.buildings) {
      //returns i as object property
      for (let j = 0; j < this.buildings.length; j++) {
        //iterates through all buildings in database
        if (this.buildings[j].name == i) {
          //verifies if object in current matches the one in the database
          let level = this.buildings[j].name; //returns name of current interation in database
          let prov = this.current.buildings[level]; //returns current level of building
          for (let x = 0; x < prov; x++) {
            total_req_prov += this.buildings[j].required.provisions[x];
          }
        }
      }
    }
    return total_req_prov;
    //total pentru taverna 276
  }

  //Calculates total provision capacity based on farm level
  //Returns INT

  getTotalProvisions() {
    let index = this.current.buildings.farm - 1
    // let total_provisions = this.buildings[1].capacity[index];
    let total_provisions = this.getBuilding("farm").capacity[index];
    return total_provisions;
  }




}
