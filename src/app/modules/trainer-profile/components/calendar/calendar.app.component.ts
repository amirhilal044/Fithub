import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { RippleModule } from 'primeng/ripple';
import { AccessTokenService } from 'src/app/modules/auth/shared/services/access-token.service';
import { NotificationsService } from 'src/app/shared/services/notifications.service';
import {
  Bundle,
  Client,
  CreateSessionEventDto,
} from '../../shared/models/client.model';
import { TrainerService } from '../../shared/services/trainer.service';
@Component({
  templateUrl: './calendar.app.component.html',
  styleUrls: ['./calendar.app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    DialogModule,
    InputTextareaModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    RippleModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    MessagesModule,
    RouterModule,
  ],
})
export class CalendarAppComponent implements OnInit {
  events: any[] = [];
  user: any;
  validSubscription: boolean = false;

  clients!: Client[];
  clientBundles!: Bundle[];

  allowEditWhenDone: boolean = false;

  clientSelected: boolean = false;
  selectedBundle: Bundle = {
    id: 0,
    sessionsNumber: 0,
    totalPrice: 0,
    description: '',
    done: false,
    remainingSessions: 0,
    sessionEvents: [],
    ghostClient: {} as Client,
  } as Bundle;

  sessionForm!: FormGroup;

  today: string = new Date().toISOString().split('T')[0];

  calendarOptions: any = {
    initialView: 'timeGridDay',
  };

  showDialog: boolean = false;

  clickedEvent: any = null;

  view: string = '';

  changedEvent: any;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly trainerService: TrainerService,
    private readonly notificationsService: NotificationsService,
    private readonly accessTokenService: AccessTokenService
  ) {}

  ngOnInit(): void {
    this.checkSubscription();
    this.getSessionEvents();
    this.getTrainerClients();
    this.createSessionForm();

    this.createCalendarOptions();
  }

  onEventClick(e: any) {
    this.selectedBundle = {
      id: 0,
      sessionsNumber: 0,
      totalPrice: 0,
      description: '',
      done: false,
      remainingSessions: 0,
      sessionEvents: [],
      ghostClient: {} as Client,
    } as Bundle;
    this.clientSelected = false;

    const sessionsBundleSessionId =
      e.event._def.extendedProps.sessionsBundleSessionId;

    this.clickedEvent = e.event;
    let plainEvent = e.event.toPlainObject({
      collapseExtendedProps: true,
      collapseColor: true,
    });
    this.view = 'display';
    this.showDialog = true;

    this.changedEvent = { ...plainEvent, ...this.clickedEvent };
    this.changedEvent.start = this.clickedEvent.start;
    this.changedEvent.end = this.clickedEvent.end
      ? this.clickedEvent.end
      : this.clickedEvent.start;

    this.changedEvent.sessionsBundleSessionId = sessionsBundleSessionId;
  }

  onDateSelect(e: any) {
    this.view = 'new';
    this.showDialog = true;
    this.changedEvent = {
      ...e,
      client: null,
      description: null,
      location: null,
      backgroundColor: null,
      borderColor: null,
      textColor: null,
      tag: { color: null, name: null },
    };
  }

  handleSave() {
    this.selectedBundle = {
      id: 0,
      sessionsNumber: 0,
      totalPrice: 0,
      description: '',
      done: false,
      remainingSessions: 0,
      sessionEvents: [],
      ghostClient: {} as Client,
    } as Bundle;
    this.clientSelected = false;

    this.showDialog = false;
    this.clickedEvent = {
      ...this.changedEvent,
      // backgroundColor: this.changedEvent.tag?.color,
      // borderColor: this.changedEvent.tag?.color,
      textColor: '#212121',
    };

    if (this.clickedEvent.hasOwnProperty('id')) {
      this.events = this.events.map((i) =>
        i.id.toString() === this.clickedEvent.id.toString()
          ? (i = this.clickedEvent)
          : i
      );
    } else {
      this.events = [
        ...this.events,
        { ...this.clickedEvent, id: Math.floor(Math.random() * 10000) },
      ];
    }
    this.calendarOptions = {
      ...this.calendarOptions,
      ...{ events: this.events },
    };
    this.clickedEvent = null;
  }

  onEditClick() {
    this.view = 'edit';
  }

  delete() {
    this.events = this.events.filter(
      (i) => i.id.toString() !== this.clickedEvent.id.toString()
    );
    this.calendarOptions = {
      ...this.calendarOptions,
      ...{ events: this.events },
    };
    this.showDialog = false;
  }

  validate() {
    let { start, end } = this.changedEvent;
    return start && end;
  }

  addNewClient() {
    this.router.navigate(['/trainer-profile/add-client']);
  }

  getTrainerClients() {
    this.trainerService.getTrainerClients().subscribe((res: Client[]) => {
      this.clients = res;
    });
  }

  createSessionForm() {
    this.sessionForm = this.formBuilder.group({
      sessionsBundleSessionId: [null],
      done: false,
      sessionsBundleId: [null],
      startDateTime: [null, Validators.required],
      endDateTime: [null, Validators.required],
      description: ' ',
      location: ' ',
    });
  }

  submitEvent() {
    const event: CreateSessionEventDto = {
      sessionsBundleSessionId: this.changedEvent.sessionsBundleSessionId,
      sessionsBundleId: this.sessionForm.get('sessionsBundleId')?.value,
      startDateTime: this.changedEvent.start,
      endDateTime: this.changedEvent.end,
      description: this.changedEvent.description,
      location: this.changedEvent.location,
    };

    if (!this.validate()) {
      this.notificationsService.showErrorMessage('Please fill in all fields.');
      return;
    }

    this.trainerService.createSessionEvent(event).subscribe(() => {
      this.notificationsService.showSuccessMessage('Event Created');

      this.handleSave();
    });
  }

  onClientChange(event: any) {
    const clientId = event.value.id;
    const isGhost = event.value.isGhost;

    this.clientSelected = true;
    this.trainerService
      .getClientBundle(clientId, isGhost)
      .subscribe((res: Bundle[]) => {
        // this.sessionForm.get('sessionsBundleId')?.patchValue(res[0].id);
        // this.sessionForm.get('description')?.patchValue(res[0].description);

        res = res.filter((bundle) => bundle.remainingSessions > 0);
        this.clientBundles = res;
      });
  }

  submitEventWhenDragged(
    startDateTime: Date,
    endDateTime: Date,
    description: string,
    location: string,
    sessionEventId: number
  ) {
    const event: CreateSessionEventDto = {
      sessionsBundleSessionId: sessionEventId,
      sessionsBundleId: this.sessionForm.get('sessionsBundleId')?.value,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      description: description,
      location: location,
    };

    this.trainerService.createSessionEvent(event).subscribe(() => {
      this.notificationsService.showSuccessMessage('Event Updated');
    });
  }

  getSessionEvents() {
    this.trainerService.getTrainerEvents().subscribe((res) => {
      this.events = res.map((item: any) => {
        return {
          id: item.id,
          title: `${item.firstname} ${item.lastname}`,
          start: item.startdatetime,
          end: item.enddatetime,
          description: item.description,
          location: item.location,
          sessionsBundleSessionId: item.id,
        };
      });
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events,
      };
    });
  }

  createCalendarOptions() {
    this.calendarOptions = {
      ...this.calendarOptions,
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      height: 720,
      initialDate: this.today,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      eventClick: (e: MouseEvent) => this.onEventClick(e),
      select: (e: MouseEvent) => this.onDateSelect(e),
      eventDrop: (info: any) => {
        let startDateTime = info.event.start;
        let endDateTime = info.event.end;

        let startDateTimeString = startDateTime
          .toLocaleString('sv-SE')
          .replace(' ', 'T')
          .slice(0, 19);
        let endDateTimeString = endDateTime
          .toLocaleString('sv-SE')
          .replace(' ', 'T')
          .slice(0, 19);

        let eventDescription = info.event.extendedProps.description;
        let eventLocation = info.event.extendedProps.location;

        let sessionEventId = info.event.id;

        this.submitEventWhenDragged(
          startDateTimeString,
          endDateTimeString,
          eventDescription,
          eventLocation,
          sessionEventId
        );
      },
    };
  }

  onBundleChange(event: any) {
    const bundleId = event.value.id;
    this.selectedBundle = this.clientBundles.find(
      (bundle: Bundle) => bundle.id === bundleId
    ) as Bundle;
    this.sessionForm
      .get('description')
      ?.patchValue(this.selectedBundle?.description);
    this.sessionForm.get('sessionsBundleId')?.patchValue(bundleId);
  }

  addNewBundle() {
    this.router.navigate(['/trainer-profile/add-bundle']);
  }

  checkSubscription() {
    this.user = this.accessTokenService.getUserInfo() || '';
    console.log(this.user);
    if (this.user.subscriptionId) {
      this.trainerService
        .checkValidSubscription(this.user.subscriptionId)
        .subscribe({
          next: (isValid: boolean) => {
            if (!isValid) {
              this.notificationsService.showErrorMessage(
                'Your subscription is invalid. Please contact support.'
              );
            } else {
              this.validSubscription = true;
            }
          },
          error: (err: any) => {},
        });
    } else {
      this.notificationsService.showErrorMessage(
        'Your subscription is invalid. Please contact support.'
      );
    }
  }
}
