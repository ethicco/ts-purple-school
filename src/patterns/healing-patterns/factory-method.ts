interface IInsurance {
  id: number;
  status: string;
  setVehicle(vehicle: string): void;
  submit(): Promise<boolean>;
}

class TFInsurance implements IInsurance {
  id!: number;
  status!: string;
  private vehicle!: string;

  setVehicle(vehicle: string): void {
    this.vehicle = vehicle;
  }

  async submit(): Promise<boolean> {
    const res = await fetch("", {
      method: "POST",
      body: JSON.stringify({ vehicle: this.vehicle }),
    });

    const data: { isSuccess: boolean } = await res.json();
    return data.isSuccess;
  }
}

class ABInsurance implements IInsurance {
  id!: number;
  status!: string;
  private vehicle!: string;

  setVehicle(vehicle: string): void {
    this.vehicle = vehicle;
  }

  async submit(): Promise<boolean> {
    const res = await fetch("ab", {
      method: "POST",
      body: JSON.stringify({ vehicle: this.vehicle }),
    });

    const data: { yes: boolean } = await res.json();
    return data.yes;
  }
}

abstract class InsuranceFactory {
  db!: {
    save: (id: number, status: string) => void;
  };

  abstract createInsurance(): IInsurance;

  saveHistory(ins: IInsurance) {
    this.db.save(ins.id, ins.status);
  }
}

class TFInsuranceFactory extends InsuranceFactory {
  createInsurance(): IInsurance {
    return new TFInsurance();
  }
}

class ABInsuranceFactory extends InsuranceFactory {
  createInsurance(): IInsurance {
    return new ABInsurance();
  }
}

const tfInsuranceFactory = new TFInsuranceFactory();
const ins = tfInsuranceFactory.createInsurance();
tfInsuranceFactory.saveHistory(ins);

const INSURANCE_TYPE = {
  tf: TFInsurance,
  ab: ABInsurance,
};

type IT = typeof INSURANCE_TYPE;

class InsuranceFactoryAlt {
  db!: {
    save: (id: number, status: string) => void;
  };

  createInsurance<T extends keyof IT>(type: T): IT[T] {
    return INSURANCE_TYPE[type];
  }

  saveHistory(ins: IInsurance) {
    this.db.save(ins.id, ins.status);
  }
}

const insuranceFactoryAlt = new InsuranceFactoryAlt();
const ins2 = new (insuranceFactoryAlt.createInsurance("tf"))();
insuranceFactoryAlt.saveHistory(ins2);
