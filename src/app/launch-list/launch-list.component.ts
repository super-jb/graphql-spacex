import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PastLaunchesListGQL } from '../services/spacexGraphql.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-launch-list',
  templateUrl: './launch-list.component.html',
  styleUrls: ['./launch-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchListComponent implements OnInit {

  constructor(private pastLaunchesService: PastLaunchesListGQL) { }

  pastLaunches$ =
    this.pastLaunchesService
      // setting limit in fetch to not get too much data
      .fetch({ limit: 30 })
      // here we extract our query data
      // we can also get info like errors or loading state from result
      .pipe(
        map((res) => res.data.launchesPast)
      );

  ngOnInit() { }
}
