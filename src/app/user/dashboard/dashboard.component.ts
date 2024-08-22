import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManageUserService } from '../Services/manage-user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Services/auth.service';
import { Router, Routes } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  Dashboard: boolean = false;
  manageUser: boolean = false;
  users: any[] = [];
  userForm!: FormGroup;
  userImageFile: File | null = null;
  activeCount!: number;
  inActiveCount!: number;
  pageNumber: number = 1;
  pageSize: number = 3;
  totalRecords: number = 0;
  totalPages: number = 10;
  filter: boolean | null = null;
  sortColumn: string = "";
  sortOrder: 'asc' | 'desc' = 'asc';
  ImagePath !:string;

  constructor(private fb: FormBuilder, private manageUserService: ManageUserService, private toastr: ToastrService, private authService: AuthService, private router:Router ) {
    this.userForm = this.fb.group({
      userId: [],
      userImage: [null],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      middleName: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      dateOfJoining: ['', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      alternatePhone: ['', Validators.maxLength(10)],
      addresses: this.fb.array([this.createAddress()], Validators.maxLength(2)),
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.Dashboard = true;
    this.manageUser = false;

    // Get All Users
    this.getAllUsers()
   
  }

  onIsActiveChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.userForm.get('isActive')?.setValue(checkbox.checked);
  }
  createAddress(): FormGroup {
    return this.fb.group({
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      country: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      zipCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(8)]],
    });
  }



  get addresses(): FormArray {
    return this.userForm.get('addresses') as FormArray;
  }

  addAddress(): void {
    if (this.addresses.length < 2) {
      this.addresses.push(this.createAddress());
    }
  }

  removeAddress(index: number): void {
    if (this.addresses.length > 1) {
      this.addresses.removeAt(index);
    }
  }


  ManageUser() {
    this.manageUser = true;
    this.Dashboard = false;
  }

  // Get All Users
  getAllUsers() {
    try{
    this.manageUserService.getAllUsers(this.pageNumber, this.pageSize).subscribe({
      next: (response: any) => {
        console.log("Users fetched successfully:", response); // Detailed response log
        this.users = response;
        this.totalRecords = response.totalRecords;
  
        // Active/Inactive code
        this.activeCount = this.users.filter(user => user.IsActive == true).length;
        this.inActiveCount = this.users.filter(user => user.IsActive == false).length;
      },
      error: (err: any) => {
        console.error("Error fetching users", err);
        this.toastr.error("Error fetching users");
      }
    });
  }
  catch (ex) {
    // Log the exception and provide feedback
    this.toastr.error("An unexpected error occurred while fetching users.");
  }
  }

  onPageChange(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.pageNumber = pageNumber;
      this.getAllUsers();
    }
  }

  showActiveInactiveUsers(isActive: boolean) {
    try{
      this.filter = isActive; 
    this.manageUserService.filterUser(this.filter).subscribe({
      next: (res: any) => {
        console.log(isActive ? "Active Users! " : "Inactive Users: ", res);
        this.users = res;
        //Active/ Inactive code 
        this.activeCount = this.users.filter(user => user.IsActive == true).length;
        this.inActiveCount = this.users.filter(user => user.IsActive == false).length;
        this.toastr.success(isActive ? "Active Users!" : "Inactive Users!");
      },
      error: (err: any) => {
        console.error(isActive ? "Active User Error" : "Inactive User Error", err);
        this.toastr.error(isActive ? "Active User Error" : "Inactive User Error");
      }
    });
    }
    catch{
      this.toastr.error("An unexpected error occurred while Active/Inactive users.");
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userImageFile = file;
      

      // Create an object URL for the image file
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.ImagePath = e.target.result; // This will be the base64 data URL
    };
    reader.readAsDataURL(file); // Read the file and trigger onload event

    }
  }

  // Add New User
  onSubmit() {
    if (this.userForm.valid) {
      const formData = new FormData();
      const UserId = this.userForm.get('userId')?.value;

      // Append form fields to FormData
      Object.keys(this.userForm.controls).forEach(key => {
        const value = this.userForm.get(key)?.value;
        if (key === 'userImage' && this.userImageFile) {
          formData.append('Image', this.userImageFile); // Append the file with correct field name
        } else if (key === 'addresses') {
          value.forEach((address: any, index: number) => {
            console.log(`Address ${index}:`, address);
            formData.append(`AddresssAbhi[${index}].City`, address.city);
            formData.append(`AddresssAbhi[${index}].State`, address.state);
            formData.append(`AddresssAbhi[${index}].Country`, address.country);
            formData.append(`AddresssAbhi[${index}].ZipCode`, address.zipCode);
            formData.append(`AddresssAbhi[${index}].AId`, (index + 1).toString());
          });
        } else if (key !== 'userId') {
          formData.append(key, value); // Append other form fields except userId
        }
      });

      if (UserId) {
        // Update user
        formData.append('userId', UserId); // Append userId only when updating
        debugger
        this.manageUserService.updateUser(formData).subscribe({
          next: (res: any) => {
            console.log("User updated successfully", res);
            this.toastr.success('User Updated Successfully!');
            this.getAllUsers(); // Refresh the list of users
            this.manageUser = false;
            this.Dashboard = true;
          },
          error: (err: any) => {
            console.log("Error updating user", err);
            this.toastr.error('Error updating user');
          }
        });
      } else {
        // Add new user
        this.manageUserService.createUser(formData).subscribe({
          next: (res: any) => {
            console.log("User created successfully", res);
            this.toastr.success('User Added Successfully!');
            
            const token = res.token;
            const userId = res.userId;

            // Store userId in sessionStorage
            sessionStorage.setItem('userId', userId);

            // Store token using the auth service
            this.authService.storeToken(userId);
            this.getAllUsers(); // Refresh the list of users
            this.manageUser = false;
            this.Dashboard = true;
          },
          error: (err: any) => {
            console.log("Error", err);
            this.toastr.error('Error');
          }
        });
      }
    } else {
      this.toastr.error('Please fill out the form correctly.');
    }
  }


  //Delete User
  deleteUser(UserId: number) {
    this.manageUserService.deleteUser(UserId).subscribe({
      next: (res: any) => {
        console.log("User Deleted: ", res);
        this.toastr.success("User Deleted");
        this.getAllUsers();
      },
      error: (err: any) => {
        console.log("Delete Error: ", err);
        this.toastr.error("User Not Deleted");
      }
    });
  }

  //Edit User
  editUser(userID: number): void {
    const user = this.users.find(u => u.UserId === userID);
    if (user) {
      // Make a copy of the user data to avoid mutating the original object
      const userToEdit = { ...user };

      // Function to format date to YYYY-MM-DD
      const formatDate = (date: any) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Extract only the date part
      };
      // Patch the form with the copied user data
      console.log(userToEdit);
      this.ImagePath = `https://localhost:7215/${userToEdit.ImagePath}`

      this.userForm.patchValue({
        userId: userToEdit.UserId,
        firstName: userToEdit.FirstName,
        middleName: userToEdit.MiddleName,
        lastName: userToEdit.LastName,
        gender: userToEdit.Gender,
        dob: formatDate(userToEdit.Dob),
        email: userToEdit.Email,
        dateOfJoining: formatDate(userToEdit.DateOfJoining),
        phone: userToEdit.Phone,
        alternatePhone: userToEdit.AlternatePhone,
        isActive: userToEdit.IsActive,
      });      

      // Clear the existing addresses form array
      this.addresses.clear();

      // Populate the addresses form array with the user's addresses
      userToEdit.AddresssAbhis.forEach((address: any) => {
        const addressForm = this.fb.group({
          city: [address.City, Validators.required],
          state: [address.State, Validators.required],
          country: [address.Country, Validators.required],
          zipCode: [address.ZipCode, Validators.required],
        });
        this.addresses.push(addressForm);
      });

      // Show the form for editing
      this.manageUser = true;
      this.Dashboard = false;
    }
  }

  //Sort Users by Columns
  sortData(column: string): void {
    this.sortColumn = column;
    if (this.sortColumn === column) {
      // Toggle sort order if the same column is clicked
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to ascending if a new column is clicked
      this.sortOrder = 'asc';
    }

    this.manageUserService.sortUsers(this.sortColumn).subscribe({
      next:(res:any) => {
        console.log("User Sorted ", res);
        this.users = res;
        this.toastr.success("Users Sorted");
      },
      error:(err:any) => {
        console.log("Sorting Error ", err);
        this.toastr.error("Error Sorted");
      }
    });
    
  }

  exportToExcel(){
    this.manageUserService.exportExcel().subscribe({
      next:(res:any) =>{
        this.toastr.success("Excel Downloaded");
      },
      error:(error) =>{
        this.toastr.error("Error Downloading Excel");
      }
    })
  }
}


