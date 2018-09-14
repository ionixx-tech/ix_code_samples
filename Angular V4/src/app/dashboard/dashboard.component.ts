import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html?v=${new Date().getTime()}'
})

export class DashboardComponent implements OnInit{
ngOnInit() {
}
}
