import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotComponent } from './forgot/forgot.component';
import { EmailComponent } from './email/email.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { authGuard } from './auth.guard';
import { ChangepassComponent } from './changepass/changepass.component';

const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'dashboard', component:DashboardComponent, canActivate:[authGuard]},
  {path:'forgot', component:ForgotComponent},
  {path:'email', component:EmailComponent},
  {path:'reset', component:ResetpasswordComponent},
  {path:'change', component:ChangepassComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
