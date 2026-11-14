type LiteralTypes = string | number | bigint | undefined | null | boolean;
type ArrayAnyTypes = Array<LiteralTypes | object | symbol | ArrayAnyTypes>;
