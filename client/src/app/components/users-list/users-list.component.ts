import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})

export class UsersListComponent implements OnInit {

  @Input() usersList: Array<string> = [];
  constructor() {}

  ngOnInit() {

  }

}
