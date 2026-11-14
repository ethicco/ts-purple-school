function MethodDec<This, Args extends unknown[], Return>(
  method: (this: This, ...args: Args) => Return,
  _context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >,
) {
  console.log("Init method");
  return function (this: This, ...args: Args): Return {
    return method.call(this, ...args);
  };
}

function Max(num: number) {
  return function <This, Args extends unknown[], Return>(
    method: (this: This, ...args: Args) => Return,
    _context: ClassMethodDecoratorContext<
      This,
      (this: This, ...args: Args) => Return
    >,
  ) {
    console.log("Init method");
    return function (this: This, ...args: Args): Return {
      if (typeof args[0] === "number" && args[0] > num) {
        throw new Error(`Значение больше ${num}`);
      }

      return method.call(this, ...args);
    };
  };
}

function ClassDec<This, Args extends unknown[]>(
  target: new (...args: Args) => This,
  context: ClassDecoratorContext<new (...args: Args) => This>,
) {
  console.log("Class method");
}

function FieldDec<This>(
  target: undefined,
  context: ClassFieldDecoratorContext<This, string>,
) {
  console.log("Field init");
  return function (value: string) {
    return value;
  };
}

function IsString<This, Arg extends string, Return>(
  target: (this: This, arg: Arg) => Return,
  context: ClassSetterDecoratorContext<This, Arg>,
) {
  context.addInitializer(() => {
    console.log("hooks");
  });

  console.log("Init SetDec");

  return function (this: This, arg: Arg): Return {
    if (typeof arg !== "string") {
      throw new Error("Не строка");
    }

    const res = target.call(this, arg);

    return res;
  };
}

@ClassDec
class Demo {
  private _surname: string = "";

  @FieldDec
  name: string = "Test";

  @IsString
  set surname(value: string) {
    this._surname = value;
  }

  @Max(10)
  exec(a: number) {
    console.log(a);
  }
}

const demo = new Demo();

demo.exec(1);
//demo.exec(11);
