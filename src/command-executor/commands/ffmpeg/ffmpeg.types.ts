import { ICommandExec } from "../../core/executor/command.type";

export interface IFfmpegInput {
  width: number;
  height: number;
  path: string;
  name: string;
}

export interface ICommandExecFfmpeg extends ICommandExec {
  output: string;
}
