interface IMediator {
  notify(sender: string, event: string): void;
}

abstract class Mediator {
  mediator!: IMediator;

  sendMediator(mediator: IMediator) {
    this.mediator = mediator;
  }
}

class Notifications {
  send() {
    console.log("Sending notification");
  }
}

class Log {
  log(message: string) {
    console.log(message);
  }
}
class EventHandler extends Mediator {
  myEvent() {
    this.mediator.notify("EventHAndler", "myEvent");
  }
}

class NotificationMediator implements IMediator {
  constructor(
    public notification: Notifications,
    public logger: Log,
    public handler: EventHandler,
  ) {}

  notify(_: string, event: string): void {
    switch (event) {
      case "myEvent":
        this.notification.send();
        this.logger.log("sent");
        break;
    }
  }
}

const handler = new EventHandler();
const logger = new Log();
const notification = new Notifications();

const m = new NotificationMediator(notification, logger, handler);

handler.sendMediator(m);
handler.myEvent();
