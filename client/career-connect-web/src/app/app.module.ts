import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { AdminModule } from './admin/admin.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    AdminModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'jobs-notifier-3dbb5',
        appId: '1:642190323549:web:a8e038de9e4994242982b4',
        storageBucket: 'jobs-notifier-3dbb5.appspot.com',
        apiKey: 'AIzaSyAiSeACSj7mKyHDrE5eHOg2p9xjhRq5Jek',
        authDomain: 'jobs-notifier-3dbb5.firebaseapp.com',
        messagingSenderId: '642190323549',
        measurementId: 'G-K7YLQ7KV90',
      })
    ),
    provideAuth(() => getAuth()),
    provideMessaging(() => getMessaging()),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
