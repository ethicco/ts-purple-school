interface IObserver {
  update(subject: ISubject): void;
}

interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(): void;
}

class Lead {
  constructor(
    public name: string,
    public phone: string,
  ) {}
}

class NewLead implements ISubject {
  private observers: IObserver[] = [];
  public state!: Lead;

  attach(observer: IObserver): void {
    if (this.observers.includes(observer)) {
      return;
    }

    this.observers.push(observer);
  }
  detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);

    if (observerIndex === -1) {
      return;
    }

    this.observers.splice(observerIndex, 1);
  }
  notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}

class NotificationService implements IObserver {
  update(subject: ISubject): void {
    console.log(`NotificationService received notification`);
    console.log(subject);
  }
}

class LeadService implements IObserver {
  update(subject: ISubject): void {
    console.log(`LeadService received notification`);
    console.log(subject);
  }
}

const subject = new NewLead();
subject.state = new Lead("Den", "1");
const s1 = new NotificationService();
const s2 = new LeadService();

subject.attach(s1);
subject.attach(s2);
subject.notify();
subject.detach(s1);
subject.detach(s2);
subject.notify();
