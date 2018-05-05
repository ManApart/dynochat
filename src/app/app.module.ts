import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CharacterSelectComponent } from './character-select/character-select.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { DataService } from './data.service';
import { ChatManagerService } from './chat-manager.service';
declare var require: any;


@NgModule({
  declarations: [
    AppComponent,
    CharacterSelectComponent,
    ChatBoxComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [DataService, ChatManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
