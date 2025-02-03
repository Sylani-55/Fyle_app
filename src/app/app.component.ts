import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'; // ✅ Import MatCardModule
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule, // ✅ Ensure MatCardModule is imported
    FormsModule // ✅ Ensure FormsModule is included for two-way binding
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  displayedColumns: string[] = ['name', 'workouts', 'numberOfWorkouts', 'totalMinutes'];

  workoutTypes: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga'];
  selectedWorkoutType: string = '';

  newUserName: string = '';
  newWorkoutType: string = '';
  newWorkoutMinutes: number | null = null;

  dataSource = new MatTableDataSource([
    { name: 'John Doe', workouts: 'Running, Cycling', numberOfWorkouts: 2, totalMinutes: 75 },
    { name: 'Jane Smith', workouts: 'Swimming, Running', numberOfWorkouts: 2, totalMinutes: 80 },
    { name: 'Mike Johnson', workouts: 'Yoga, Cycling', numberOfWorkouts: 2, totalMinutes: 90 }
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.dataSource.filterPredicate = (data, filter) => {
      const normalizedFilter = filter.trim().toLowerCase();
      const workoutList = data.workouts.toLowerCase().split(',').map(w => w.trim());
      return normalizedFilter === '' || workoutList.includes(normalizedFilter);
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  applyWorkoutFilter() {
    this.dataSource.filter = this.selectedWorkoutType.trim().toLowerCase();
  }

  addWorkout() {
    if (this.newUserName && this.newWorkoutType && this.newWorkoutMinutes !== null) {
      const existingUser = this.dataSource.data.find(user => user.name === this.newUserName);
      if (existingUser) {
        existingUser.workouts += `, ${this.newWorkoutType}`;
        existingUser.numberOfWorkouts += 1;
        existingUser.totalMinutes += this.newWorkoutMinutes;
      } else {
        this.dataSource.data.push({
          name: this.newUserName,
          workouts: this.newWorkoutType,
          numberOfWorkouts: 1,
          totalMinutes: this.newWorkoutMinutes
        });
      }
      this.dataSource._updateChangeSubscription(); // ✅ Refresh the table
    }
  }
}
