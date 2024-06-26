import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './modules/auth/shared/services/auth-guard.service';
import { HomePageComponent } from './modules/home-page/home-page/home-page.component';
import {
  AuthRoutes,
  ModuleRoutes,
  NutritionalGuidanceRoutes,
  TrainerProfileRoutes,
  WorkoutPlanRoutes,
} from './shared/enums/routes.enum';
import { LoadedComponent } from './shared/types/general.types';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: ModuleRoutes.Auth,
        children: [
          {
            path: AuthRoutes.Login,
            canActivate: [AuthGuard],
            loadComponent: () =>
              import('./modules/auth/components/login/login.component').then(
                (x: LoadedComponent) => x.LoginComponent
              ),
          },
          {
            path: AuthRoutes.AccessDenied,
            loadComponent: () =>
              import(
                './modules/auth/components/accessdenied/accessdenied.component'
              ).then((x: LoadedComponent) => x.AccessdeniedComponent),
          },
          {
            path: AuthRoutes.Error,
            loadComponent: () =>
              import('./modules/auth/components/error/error.component').then(
                (x: LoadedComponent) => x.ErrorComponent
              ),
          },
          {
            path: AuthRoutes.ForgotPassword,
            loadComponent: () =>
              import(
                './modules/auth/components/forgotpassword/forgotpassword.component'
              ).then((x: LoadedComponent) => x.ForgotPasswordComponent),
          },
          {
            path: AuthRoutes.NewPassword,
            loadComponent: () =>
              import(
                './modules/auth/components/newpassword/newpassword.component'
              ).then((x: LoadedComponent) => x.NewPasswordComponent),
          },
          {
            canActivate: [AuthGuard],
            path: AuthRoutes.Register,
            loadComponent: () =>
              import(
                './modules/auth/components/register/register.component'
              ).then((x: LoadedComponent) => x.RegisterComponent),
          },
          {
            // canActivate: [VerificationRoutingGuard],
            path: AuthRoutes.Verification,
            loadComponent: () =>
              import(
                './modules/auth/components/verification/verification.component'
              ).then((x: LoadedComponent) => x.VerificationComponent),
          },
        ],
      },
      {
        path: ModuleRoutes.TrainerProfile,
        canActivate: [AuthGuard],
        children: [
          {
            path: TrainerProfileRoutes.CreateAboutUs,
            loadComponent: () =>
              import(
                './modules/trainer-profile/components/editing-profile/create-aboutus/create-aboutus.component'
              ).then((x: LoadedComponent) => x.CreateAboutusComponent),
          },
          {
            path: TrainerProfileRoutes.ShowAboutUs,
            loadComponent: () =>
              import(
                './modules/trainer-profile/components/showing-profile/aboutus/aboutus.component'
              ).then((x: LoadedComponent) => x.AboutUsComponent),
          },
          {
            path: `${TrainerProfileRoutes.ShowAboutUs}/:id`,
            loadComponent: () =>
              import(
                './modules/trainer-profile/components/showing-profile/aboutus/aboutus.component'
              ).then((x: LoadedComponent) => x.AboutUsComponent),
          },
          {
            path: TrainerProfileRoutes.Calendar,
            loadComponent: () =>
              import(
                './modules/trainer-profile/components/calendar/calendar.app.component'
              ).then((x: LoadedComponent) => x.CalendarAppComponent),
          },
          {
            path: TrainerProfileRoutes.AddClient,
            loadComponent: () =>
              import(
                './modules/trainer-profile/components/add-client/add-client.component'
              ).then((x: LoadedComponent) => x.AddClientComponent),
          },
          {
            path: TrainerProfileRoutes.addBunle,
            loadComponent: () =>
              import(
                './modules/trainer-profile/components/add-bundle/add-bundle.component'
              ).then((x: LoadedComponent) => x.AddBundleComponent),
          },
        ],
      },
      {
        path: ModuleRoutes.nutritionalGuidance,
        children: [
          {
            path: NutritionalGuidanceRoutes.MealPlan,
            loadComponent: () =>
              import(
                './modules/nutritional-guidance/components/meal-plan/meal-plan.component'
              ).then((x: LoadedComponent) => x.MealPlanComponent),
          },
        ],
      },
      {
        path: ModuleRoutes.WorkoutPlan,
        // canActivate: [AuthGuard],
        children: [
          {
            path: WorkoutPlanRoutes.AiCustomWorkout,
            loadComponent: () =>
              import(
                './modules/workout-plan/components/ai-custom-workout/ai-custom-workout.component'
              ).then((x: LoadedComponent) => x.AiCustomWorkoutComponent),
          },
        ],
      },
      {
        path: 'payment/:subscriptionType/:paymentId',
        loadComponent: () =>
          import('./modules/payment/checkout/checkout.component').then(
            (m) => m.CheckoutComponent
          ),
      },
      {
        path: 'success',
        loadComponent: () =>
          import('./modules/payment/success/success.component').then(
            (m) => m.SuccessComponent
          ),
      },
      {
        path: 'home-page',
        component: HomePageComponent,
      },
      {
        path: '**',
        redirectTo: 'home-page',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
